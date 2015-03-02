unit YDKJUnit;

interface

uses Graphics;

type subimages=record // Type à utiliser uniquement sous forme de pointeur (subimages^) car structure trop grande pour la pile (stack overflow)
       fps1,fps2:word;
       nbframes:word;
       frames:array[0..3000] of record
         nbimages:word;
         images:array[0..64] of record
           val1:byte; // Valeur inconnue : 0, 16, 167
           offsetx,offsety:smallint;
           sizex,sizey:word;
           imgindex:word;
         end;
       end;
       nbimages:word;
       images:array[0..1000] of record
         width,height:word;
         offset:longint;
       end;
     end;

type subsound=record
       aifc:boolean; // si false, c'est du wav normal
       offset,size:longword;
       samples:longword;
       bitrate,frames,rate:word;
     end;

type subsubfile=record
       subname:longint;
       fileoffset,filesize:longword;
       data:pointer; // Pointeur qui dépendra du type
     end;

type subfile=record
       ftype:string[4]; // off4, snd....
       nbsub:word;
       subfile:array[0..1000] of subsubfile;
     end;

var SRFhandler:file;
    SRFdata:record
      loaded:boolean;
      nbfiles:word;
      filelist:array[0..255] of subfile;
    end;
    qhdrCSV:string;
    stringsCSV:string;

function openSRF(filename:string):shortint;
procedure closeSRF;
function filetype(ftype:string):string;
procedure exportSubimagesToGif(ssf:subsubfile;filename:string);
procedure exportSubsoundToFile(ssf:subsubfile;filename:string);
function readString(ssf:subsubfile):string;
procedure exportStringToFile(ssf:subsubfile;filename:string);
function exportStringlist(ssf:subsubfile):string;
function exportStringlist1(ssf:subsubfile):string;
function exportStringlist2(ssf:subsubfile):string;
function exportAnswers(ssf:subsubfile):string;
procedure exportQHeadersToFile(ssf:subsubfile);

procedure decodeImageBuffer(buf:array of byte; var bufresult:array of longint; buflen:longint);

function idfileoff4:word;

implementation

uses SysUtils,GifImage;

var colors:array[0..255] of longint;
    rgbtopalette:array[0..255] of array[0..255] of array[0..255] of byte;
    graphic:array[0..307200] of byte;
    picture:array[0..307200] of longint;

// Fonctions palette

procedure InitColors;
var palette:TBitmap;
    i:byte;
    l:longint;
    r,g,b:byte;
begin
  palette:=TBitmap.Create;
  palette.LoadFromResourceName(hinstance,'PALETTE');
  for i:=0 to 255 do begin
    l:=palette.Canvas.Pixels[i,0];
    colors[i]:=l;
    b:=l and $FF;
    l:=l shr 8;
    g:=l and $FF;
    l:=l shr 8;
    r:=l and $FF;
    rgbtopalette[r][g][b]:=i;
  end;
  palette.Free;
end;

function pixel2palette(l:longint):byte;
var r,g,b:byte;
begin
  b:=l and $FF;
  l:=l shr 8;
  g:=l and $FF;
  l:=l shr 8;
  r:=l and $FF;
  result:=rgbtopalette[r][g][b];
end;

function GetColorIndex(GIF: TGIFSubImage; Color: TColor): Integer;
var
  idx, x, y: Integer;
begin
  // Find index for color in the colormap.
  // The same color can be in the colormap more than once.
  // Not all color indexes may be in use, so check if this index is being used.
  // Return only an index which is actually being used in the image.
  // If the index is not being used in the image,
  // try to find the next index for the color in the colormap.
  for idx := 0 to GIF.ActiveColorMap.Count - 1 do
    if GIF.ActiveColorMap.Colors[idx] = Color then
    begin
      // Found an index, is it being used in the image?
      for y := 0 to GIF.Height-1 do
        for x := 0 to GIF.Width-1 do
          if GIF.Pixels[x, y] = idx then
          begin
            Result := idx;  // Index is used in image.
            Exit;
          end;
      // Index not used in the image, try next index.
    end;
  Result := -1;  // didn't find index for the color
end;

// Lecture du fichier

function BE4(l:Longword):Longword; // bigendian 4 octets
begin
  result:=((l and $FF) shl 24) or ((l and $FF00) shl 8) or ((l and $FF0000) shr 8) or ((l and $FF000000) shr 24);
end;

function readlw:longint; // lire un longword (ou longint peu importe) en bigendian
var l:longint;
begin
  blockread(SRFhandler,l,4);
  result:=BE4(l);
end;

function BE2(l:word):word; // bigendian 2 octets
begin
  result:=((l and $FF) shl 8) or ((l and $FF00) shr 8);
end;

function readw:word; // lire un word en bigendian
var l:word;
begin
  blockread(SRFhandler,l,2);
  result:=BE2(l);
end;

function readb:word; // lire un byte
var l:byte;
begin
  blockread(SRFhandler,l,1);
  result:=l;
end;

// Décodage des images

procedure decodeImageBuffer(buf:array of byte; var bufresult:array of longint; buflen:longint);
var bitmap:array[0..307200] of byte;
    infos:array[0..2] of byte;
    status:byte;
    widebf:word;
    pos,i,l,offset,extrapixels:longint;
    nbrepeat:word;
    nextbg,bglength:longint;

begin
  l:=0;
  pos:=0;
  extrapixels:=buf[0]-2;
  bglength:=-1;
  nextbg:=buf[0]+buf[1];
  for i:=0 to 2 do begin
    bitmap[l]:=buf[pos];inc(pos);
    inc(l);
  end;
  while (l+extrapixels < buflen) and (l < 307200) do begin
    widebf:=buf[pos];inc(pos);
    widebf:=(widebf shl 1) or 1;
    while (widebf and $FF) <> 0 do begin
      status := (widebf and $100) shr 8;
      widebf := widebf shl 1;
      if (status = 0) then begin // Pixel copié tel quel
        if (l = nextbg-extrapixels) or (bglength <> -1) then begin
          if (bglength = -1) then bglength:=buf[pos] else begin
            inc(extrapixels,bglength-2);
            inc(nextbg,bglength+buf[pos]);
            bglength:=-1;
          end;
        end;
        bitmap[l]:=buf[pos];inc(pos);
        inc(l);
      end else begin // Répétition
        infos[0]:=buf[pos];inc(pos);
        infos[1]:=buf[pos];inc(pos);
        if (infos[1] and $F0) = 0 then begin // Répétition à 3 octets
          infos[2]:=buf[pos];inc(pos);
          nbrepeat:=infos[2]+$10;
        end else begin // Répétition à 2 octets
          nbrepeat:=infos[1] and $F0;
          nbrepeat:=nbrepeat shr 4;
        end;
        offset:=l-(infos[0]+$100*(infos[1] and $0F));  // Répétition, offset : line[0]+0x100*LO(line[1]), qté = HI(line[1])+2
        for i:=1 to nbrepeat+2 do begin
          if (l = nextbg-extrapixels) or (bglength <> -1) then begin
            if (bglength = -1) then bglength:=bitmap[offset] else begin
              inc(extrapixels,bglength-2);
              inc(nextbg,bglength+bitmap[offset]);
              bglength:=-1;
            end;
          end;
          bitmap[l]:=bitmap[offset];inc(offset);
          inc(l);
        end;
      end;
    end;
  end;

  nextbg:=0;
  bglength:=-1;
  // Extraction à partir de bitmap
  pos:=0;
  for i:=0 to l-1 do begin
    if (bglength <> -1) then begin
      inc(nextbg,bglength+bitmap[i]);
      while bglength > 0 do begin
        bufresult[pos]:=$FF80FF; // Transparent (couleur inexistante dans la palette, rose clair)
        inc(pos);
        dec(bglength);
        if (pos >= 307200) then break; // TODO: QNUMBERS.SRF, image n°48 (la dernière) fait dépasser la valeur de la position...
      end;
      bglength:=-1;
    end else if (pos=nextbg) then begin
      bglength:=bitmap[i];
    end else begin
      bufresult[pos] := colors[bitmap[i]];
      inc(pos);
    end;
    if (pos >= 307200) then break;
  end;
end;

// Export des images/animations en Gif+JS

const verticalGIF = 1; // 1 = GIF en mode vertical, 0 en mode horizontal

procedure exportSubimagesToGif(ssf:subsubfile;filename:string);
var si:^subimages;
    GIF:TGifImage;
    Ext: TGIFGraphicControlExtension;
    ResultAdd:Integer;
    idx: Integer;
    pic:TPicture;
    w,h,x,y,realx,realy:integer;
    pos,graphlen: longint;
    off4pos,i,j:word;
    maxwidth,maxheight:integer;
    js:string;
    f:system.text;
begin
  // Positionnement très simple et très inefficace des sprites
  maxwidth:=0;maxheight:=0;
  js:='';
  si:=ssf.data;

  if si^.nbimages > 0 then begin

  for off4pos:=0 to si^.nbimages-1 do with si^.images[off4pos] do begin
    if (verticalGIF = 1) then begin
      if (width > maxwidth) then maxwidth:=width;
      inc(maxheight,height);
    end else begin
      if (height > maxheight) then maxheight:=height;
      inc(maxwidth,width);
    end;
  end;

  if (verticalGIF = 1) then inc(maxheight,si^.nbimages) else inc(maxwidth,si^.nbimages);

  // Dessin à partir de longbitmap
  pic:=TPicture.Create;
  pic.Bitmap.Width:=maxwidth;
  pic.Bitmap.Height:=maxheight;
  pic.Bitmap.Canvas.Brush.Color:=$FF80FF; // Remplir l'image de la couleur transparente
  pic.Bitmap.Canvas.FillRect(pic.Bitmap.Canvas.ClipRect);

  js:=js+'res[''tiles'']=new Array();';
  realx:=0;
  realy:=0;
  for off4pos:=0 to si^.nbimages-1 do begin
    seek(SRFhandler,si^.images[off4pos].offset);
    w:=si^.images[off4pos].width;
    h:=si^.images[off4pos].height;
    blockread(SRFhandler,graphic,307200,graphlen);
    decodeImageBuffer(graphic,picture,w*h);
    js:=js+'res[''tiles'']['+inttostr(off4pos)+']={x:'+inttostr(realx)+',y:'+inttostr(realy)+',w:'+inttostr(w)+',h:'+inttostr(h)+'};';
    x:=0;
    y:=0;
    pos:=0;
    while y < h do begin
      pic.Bitmap.Canvas.Pixels[x+realx,y+realy] := picture[pos];
      inc(pos);
      inc(x);
      if (x >= w) then begin
        x:=0;
        inc(y);
      end;
    end;
    if (verticalGIF = 1) then inc(realy,h+1) else inc(realx,w+1);
  end;

  // Create GIF
  GIF := TGIFImage.Create;
  GIF.Width := maxwidth;
  GIF.Height := maxheight;
  GIF.ColorReduction := rmNone;  // rmQuantize rmNone
  //  GIF.DitherMode := dmNearest;  // no dither, use nearest color in palette
  GIF.DitherMode := dmNearest;       // dmNearest dmFloydSteinberg
  GIF.Compression := gcLZW;

  // Add image
  ResultAdd:=GIF.Add(pic.Graphic);
  // Add Graphic Control Extension (for transparent color)
  Ext := TGIFGraphicControlExtension.Create(GIF.Images[ResultAdd]);
  idx := GetColorIndex(GIF.Images[ResultAdd], $FF80FF);
  if idx in [0..255] then
  begin
    Ext.Transparent := True;
    Ext.TransparentColorIndex := idx;
  end;
  GIF.Images[ResultAdd].Extensions.Add(Ext);

  // Save GIF
  GIF.SaveToFile(filename+'.gif');

  // Release GIF
  GIF.Free;
  
  end;

  // Add frames to JS

  js:=js+#13#10'res[''frames'']=[';
  for i:=0 to si^.nbframes-1 do begin
    js:=js+'{nbimg:'+inttostr(si^.frames[i].nbimages);
    if (si^.frames[i].nbimages > 0) then begin
      js:=js+',fps1:'+inttostr(si^.fps1)+',fps2:'+inttostr(si^.fps2)+',img:[';
      for j:=0 to si^.frames[i].nbimages do begin
        js:=js+'{'
        +'val:'+inttostr(si^.frames[i].images[j].val1)+','
        +'ox:'+inttostr(si^.frames[i].images[j].offsetx)+','
        +'oy:'+inttostr(si^.frames[i].images[j].offsety)+','
        +'sx:'+inttostr(si^.frames[i].images[j].sizex)+','
        +'sy:'+inttostr(si^.frames[i].images[j].sizey)+','
        +'idx:'+inttostr(si^.frames[i].images[j].imgindex)
        +'},';
      end;
      js:=js+']';
    end;
    js:=js+'},';
  end;
  js:=js+'];';

  // Save JS
  assignfile(f,filename+'.js');
  rewrite(f);
  writeln(f,js);
  closefile(f);
end;

// Lecture du format des images (off4)

function openSubimages(filesize:longint):pointer; // ^subimages
var si:^subimages;
    imagestartpointer,currentpos2,fileoffset:longint;
    nbimages,i,j:word;
    nbframes,frameoffset:word;

    sameoffset,offsetx,offsety:smallint;
    sizex,sizey:word;
    nbframeimages:word;
begin
  getmem(si,sizeof(subimages));
  fileoffset:=filepos(SRFhandler);
  imagestartpointer:=readlw;
  // Données d'animation
  si^.fps1:=readw; // 400
  si^.fps2:=readw; // 6   400/6 = 66, 66 ms par frame ?
  nbframes:=readw;
  si^.nbframes:=nbframes;
  if nbframes > 0 then begin
  for i:=0 to nbframes-1 do begin
    frameoffset:=readw;
    if (frameoffset = 0) then begin
      si^.frames[i].nbimages:=0;
    end else begin
      currentpos2:=filepos(SRFhandler);
      seek(SRFhandler,fileoffset+10+nbframes*2+(frameoffset-1)*12);
      sameoffset:=readw; // Si différent de 0, alors on prend les mêmes images qu'à l'offset indiqué
      offsetx:=readw;
      offsety:=readw;
      sizex:=readw;
      sizey:=readw;
      nbframeimages:=readw;
      si^.frames[i].nbimages:=nbframeimages;
      si^.frames[i].images[0].val1:=0;
      si^.frames[i].images[0].offsetx:=offsetx;
      si^.frames[i].images[0].offsety:=offsety;
      si^.frames[i].images[0].sizex:=sizex;
      si^.frames[i].images[0].sizey:=sizey;
      if (sameoffset <> 0) then seek(SRFhandler,fileoffset+10+nbframes*2+sameoffset*12);
      if (nbframeimages > 0) then for j:=1 to nbframeimages do begin
        readb; // imgnum mais on l'a avec j de toutes façons
        si^.frames[i].images[j].val1:=readb;
        si^.frames[i].images[j].offsetx:=readw;
        si^.frames[i].images[j].offsety:=readw;
        si^.frames[i].images[j].sizex:=readw;
        si^.frames[i].images[j].sizey:=readw;
        si^.frames[i].images[j].imgindex:=readw;
      end;
      seek(SRFhandler,currentpos2);
    end;
  end;
  end;

  // Liste d'images
  seek(SRFhandler,fileoffset+imagestartpointer);
  nbimages:=readw;
  if (nbimages <> readw) then begin // Présent deux fois dans le fichier, pourquoi...
    //form1.Label1.caption:='Alert nbimage different';
  end;
  si^.nbimages:=nbimages;
  if nbimages > 0 then begin // On peut n'avoir aucune image, mais des frames... exemple avec 5QDemo.srf, premier bloc (42)
    if (nbimages > 1000) then raise Exception.Create('Too many images');
    for i:=0 to nbimages-1 do begin
      si^.images[i].offset:=fileoffset+readlw;
      si^.images[i].width:=readw;
      si^.images[i].height:=readw;
    end;
  end;
  result:=si;
end;

// Export des sons en wav ou aifc

procedure exportSubsoundToFile(ssf:subsubfile;filename:string);
var ss:subsound;
    f:file;
    data:array[0..8191] of byte;
    size:longword;

procedure invertdata; // Inverse les mots dans data
var i:word;
    a:byte;
begin
  for i:=0 to 4095 do begin
    a:=data[i*2];
    data[i*2]:=data[i*2+1];
    data[i*2+1]:=a;
  end;
end;

begin
  ss:=subsound(ssf.data^);
  if (ss.aifc) then assignfile(f,filename+'.aifc') else assignfile(f,filename+'.wav');
  rewrite(f,1);

  if (ss.aifc) then begin // AIFC
    // Construction du header
    data[0]:=ord('F');data[1]:=ord('O');data[2]:=ord('R');data[3]:=ord('M');
    size:=ss.size+92;
    data[4]:=(size and $FF000000) shr 24;data[5]:=(size and $FF0000) shr 16;data[6]:=(size and $FF00) shr 8;data[7]:=(size and $FF);
    data[8]:=ord('A');data[9]:=ord('I');data[10]:=ord('F');data[11]:=ord('C');data[12]:=ord('F');data[13]:=ord('V');data[14]:=ord('E');data[15]:=ord('R');
    data[16]:=$00;data[17]:=$00;data[18]:=$00;data[19]:=$04;data[20]:=$A2;data[21]:=$80;data[22]:=$51;data[23]:=$40;
    data[24]:=ord('C');data[25]:=ord('O');data[26]:=ord('M');data[27]:=ord('M');data[28]:=$00;data[29]:=$00;data[30]:=$00;data[31]:=$16;
    data[32]:=$00;data[33]:=$01;
    data[34]:=(ss.samples and $FF000000) shr 24;data[35]:=(ss.samples and $FF0000) shr 16;data[36]:=(ss.samples and $FF00) shr 8;data[37]:=(ss.samples and $FF); // Samples
    data[38]:=$00;data[39]:=$10; // sampleSize (16)
    data[40]:=(ss.frames and $FF00) shr 8;data[41]:=(ss.frames and $FF); // numSampleFrames
    data[42]:=(ss.rate and $FF00) shr 8;data[43]:=(ss.rate and $FF); // sampleRate
    data[44]:=$00;data[45]:=$00;data[46]:=$00;data[47]:=$00;
    data[48]:=$00;data[49]:=$00;data[50]:=ord('i');data[51]:=ord('m');data[52]:=ord('a');data[53]:=ord('4');data[54]:=ord('S');data[55]:=ord('S');
    data[56]:=ord('N');data[57]:=ord('D');
    size:=ss.size+38;
    data[58]:=(size and $FF000000) shr 24;data[59]:=(size and $FF0000) shr 16;data[60]:=(size and $FF00) shr 8;data[61]:=(size and $FF);
    data[62]:=$00;data[63]:=$00;
    data[64]:=$00;data[65]:=$00;data[66]:=$00;data[67]:=$00;data[68]:=$00;data[69]:=$00;

    blockwrite(f,data,70);

    // On copie les données en brut
    size:=ss.size;
    seek(SRFhandler,ss.offset);
    while size > 0 do begin
      if (size > 8192) then begin
        blockread(SRFhandler,data,8192);
        blockwrite(f,data,8192);
        dec(size,8192);
      end else begin
        blockread(SRFhandler,data,size);
        blockwrite(f,data,size);
        size:=0;
      end;
    end;

  end else begin // WAV
    // Construction du header
    data[0]:=ord('R');data[1]:=ord('I');data[2]:=ord('F');data[3]:=ord('F');
    size:=ss.size+120;
    data[4]:=(size and $FF);data[5]:=(size and $FF00) shr 8;data[6]:=(size and $FF0000) shr 16;data[7]:=(size and $FF000000) shr 24;
    data[8]:=ord('W');data[9]:=ord('A');data[10]:=ord('V');data[11]:=ord('E');data[12]:=ord('f');data[13]:=ord('m');data[14]:=ord('t');data[15]:=ord(' ');
    data[16]:=$10;data[17]:=$00;data[18]:=$00;data[19]:=$00;data[20]:=$01;data[21]:=$00;data[22]:=$01;data[23]:=$00;
    data[24]:=(ss.bitrate and $FF);data[25]:=(ss.bitrate and $FF00) shr 8;data[26]:=$00;data[27]:=$00;data[28]:=$C8;data[29]:=$AF;data[30]:=$00;data[31]:=$00;

    data[32]:=$02;data[33]:=$00;data[34]:=$10;data[35]:=$00;data[36]:=ord('d');data[37]:=ord('a');data[38]:=ord('t');data[39]:=ord('a');
    data[40]:=(ss.size and $FF);data[41]:=(ss.size and $FF00) shr 8;data[42]:=(ss.size and $FF0000) shr 16;data[43]:=(ss.size and $FF000000) shr 24;

    blockwrite(f,data,44);

    // On copie les données en brut, en inversant les word
    size:=ss.size;
    seek(SRFhandler,ss.offset);
    while size > 0 do begin
      if (size > 8192) then begin
        blockread(SRFhandler,data,8192);
        invertdata;
        blockwrite(f,data,8192);
        dec(size,8192);
      end else begin
        blockread(SRFhandler,data,size);
        invertdata;
        blockwrite(f,data,size);
        size:=0;
      end;
    end;

  end;

  closefile(f);
end;

// Lecture du format des sons (snd, M*xx)

function openSubsound(filesize:longint):pointer; // ^subsound
var ss:^subsound;
    data:array[0..41] of byte;
begin
  getmem(ss,sizeof(subsound));

  blockread(SRFhandler,data,28); // Infos inutiles a priori
  ss.bitrate:=readw;
  blockread(SRFhandler,data,12); // Infos inutiles a priori
  ss.samples:=readlw;
  ss.frames:=readw;
  ss.rate:=readw;
  blockread(SRFhandler,data,34); // Compression en 10-13
  ss.offset:=filepos(SRFhandler);
  ss.size:=filesize-84; // Taille totale moins le header

  ss.aifc:=false;

  if (data[10] = 0) and (data[11] = 0) and (data[12] = 0) and (data[13] = 0) then begin // WAV
    ss.aifc:=false;
  end else if (data[10] = $69) and (data[11] = $6D) and (data[12] = $61) and (data[13] = $34) then begin // AIFC (ima4)
    ss.aifc:=true;
  end;

  result:=ss;
end;

function MactoUTF8(c:char):string; // Caractères MAC vers UTF8
begin
  if (ord(c) = $7B) then result:=chr($C2)+chr($A0) // Espace insécable
  else if (ord(c) = $80) then result:=chr($C3)+chr($84) // Ä
  else if (ord(c) = $81) then result:=chr($C3)+chr($85) // Å
  else if (ord(c) = $82) then result:=chr($C3)+chr($87) // Ç
  else if (ord(c) = $83) then result:=chr($C3)+chr($89) // É
  else if (ord(c) = $84) then result:=chr($C3)+chr($91) // Ñ
  else if (ord(c) = $85) then result:=chr($C3)+chr($96) // Ö
  else if (ord(c) = $86) then result:=chr($C3)+chr($9C) // Ü
  else if (ord(c) = $87) then result:=chr($C3)+chr($A1) // á
  else if (ord(c) = $88) then result:=chr($C3)+chr($A0) // à
  else if (ord(c) = $89) then result:=chr($C3)+chr($A2) // â
  else if (ord(c) = $8A) then result:=chr($C3)+chr($A4) // ä
  else if (ord(c) = $8B) then result:=chr($C3)+chr($A3) // ã
  else if (ord(c) = $8C) then result:=chr($C3)+chr($A5) // å
  else if (ord(c) = $8D) then result:=chr($C3)+chr($A7) // ç
  else if (ord(c) = $8E) then result:=chr($C3)+chr($A9) // é
  else if (ord(c) = $8F) then result:=chr($C3)+chr($A8) // è
  else if (ord(c) = $90) then result:=chr($C3)+chr($AA) // ê
  else if (ord(c) = $91) then result:=chr($C3)+chr($AB) // ë
  else if (ord(c) = $92) then result:=chr($C3)+chr($AD) // í
  else if (ord(c) = $93) then result:=chr($C3)+chr($AC) // ì
  else if (ord(c) = $94) then result:=chr($C3)+chr($AE) // î
  else if (ord(c) = $95) then result:=chr($C3)+chr($AF) // ï
  else if (ord(c) = $96) then result:=chr($C3)+chr($B1) // ñ
  else if (ord(c) = $97) then result:=chr($C3)+chr($B3) // ó
  else if (ord(c) = $98) then result:=chr($C3)+chr($B2) // ò
  else if (ord(c) = $99) then result:=chr($C3)+chr($B4) // ô
  else if (ord(c) = $9A) then result:=chr($C3)+chr($B6) // ö
  else if (ord(c) = $9B) then result:=chr($C3)+chr($B5) // õ
  else if (ord(c) = $9C) then result:=chr($C3)+chr($BA) // ú
  else if (ord(c) = $9D) then result:=chr($C3)+chr($B9) // ù
  else if (ord(c) = $9E) then result:=chr($C3)+chr($BB) // û
  else if (ord(c) = $9F) then result:=chr($C3)+chr($BC) // ü
  else if (ord(c) = $A0) then result:=chr($E2)+chr($80)+chr($A0) // †
  else if (ord(c) = $A1) then result:=chr($C2)+chr($B0) // °
  else if (ord(c) = $A2) then result:=chr($C2)+chr($AE) // ®
  else if (ord(c) = $A3) then result:=chr($C2)+chr($A3) // £
  else if (ord(c) = $A4) then result:=chr($C2)+chr($A7) // §
  else if (ord(c) = $A5) then result:=chr($E2)+chr($80)+chr($A2) // •
  else if (ord(c) = $A6) then result:=chr($C2)+chr($B6) // ¶
  else if (ord(c) = $A7) then result:=chr($C3)+chr($9F) // ß
  else if (ord(c) = $A8) then result:=chr($C2)+chr($AE) // ®
  else if (ord(c) = $A9) then result:=chr($C2)+chr($A9) // ©
  else if (ord(c) = $AA) then result:=chr($E2)+chr($84)+chr($A2) // ™
  else if (ord(c) = $AB) then result:=chr($C2)+chr($B4) // ´
  else if (ord(c) = $AC) then result:=chr($C2)+chr($A8) // ¨
  else if (ord(c) = $AD) then result:=chr($E2)+chr($89)+chr($A0) // ?
  else if (ord(c) = $AE) then result:=chr($C3)+chr($86) // Æ
  else if (ord(c) = $AF) then result:=chr($C3)+chr($98) // Ø
  else if (ord(c) = $B0) then result:=chr($E2)+chr($88)+chr($9E) // 8
  else if (ord(c) = $B1) then result:=chr($C2)+chr($B1) // ±
  else if (ord(c) = $B2) then result:=chr($E2)+chr($89)+chr($A4) // =
  else if (ord(c) = $B3) then result:=chr($E2)+chr($89)+chr($A5) // =
  else if (ord(c) = $B4) then result:=chr($C2)+chr($A5) // ¥
  else if (ord(c) = $B5) then result:=chr($C2)+chr($B5) // µ
  else if (ord(c) = $B6) then result:=chr($E2)+chr($88)+chr($82) // ?
  else if (ord(c) = $B7) then result:=chr($C3)+chr($9F) // ß
  else if (ord(c) = $B8) then result:=chr($E2)+chr($88)+chr($8F) // ?
  else if (ord(c) = $B9) then result:=chr($CF)+chr($80) // p
  else if (ord(c) = $BA) then result:=chr($E2)+chr($88)+chr($AB) // ?
  else if (ord(c) = $BB) then result:=chr($C2)+chr($AA) // ª
  else if (ord(c) = $BC) then result:=chr($C2)+chr($BA) // º
  else if (ord(c) = $BD) then result:=chr($CE)+chr($A9) // O
  else if (ord(c) = $BE) then result:=chr($C3)+chr($A6) // æ
  else if (ord(c) = $BF) then result:=chr($C3)+chr($B8) // ø
  else if (ord(c) = $C0) then result:=chr($C2)+chr($BF) // ¿
  else if (ord(c) = $C1) then result:=chr($C2)+chr($A1) // ¡
  else if (ord(c) = $C2) then result:=chr($C2)+chr($AC) // ¬
  else if (ord(c) = $C3) then result:=chr($E2)+chr($88)+chr($9A) // v
  else if (ord(c) = $C4) then result:=chr($C6)+chr($92) // ƒ
  else if (ord(c) = $C5) then result:=chr($E2)+chr($89)+chr($88) // ˜
  else if (ord(c) = $C6) then result:=chr($CE)+chr($94) // ?
  else if (ord(c) = $C7) then result:=chr($C2)+chr($AB) // «
  else if (ord(c) = $C8) then result:=chr($C2)+chr($BB) // »
  else if (ord(c) = $C9) then result:=chr($E2)+chr($80)+chr($A6) // …
  else if (ord(c) = $CA) then result:=chr($C2)+chr($A0) //  
  else if (ord(c) = $CB) then result:=chr($C3)+chr($80) // À
  else if (ord(c) = $CC) then result:=chr($C3)+chr($83) // Ã
  else if (ord(c) = $CD) then result:=chr($C3)+chr($95) // Õ
  else if (ord(c) = $CE) then result:=chr($C5)+chr($92) // Œ
  else if (ord(c) = $CF) then result:=chr($C5)+chr($93) // œ
  else if (ord(c) = $D0) then result:=chr($E2)+chr($80)+chr($93) // –
  else if (ord(c) = $D1) then result:=chr($E2)+chr($80)+chr($94) // —
  else if (ord(c) = $D2) then result:=chr($E2)+chr($80)+chr($9C) // “
  else if (ord(c) = $D3) then result:=chr($E2)+chr($80)+chr($9D) // ”
  else if (ord(c) = $D4) then result:=chr($E2)+chr($80)+chr($98) // ‘
  else if (ord(c) = $D5) then result:=chr($E2)+chr($80)+chr($99) // ’
  else if (ord(c) = $D6) then result:=chr($C3)+chr($B7) // ÷
  else if (ord(c) = $D7) then result:=chr($E2)+chr($97)+chr($8A) // ?
  else if (ord(c) = $D8) then result:=chr($C3)+chr($BF) // ÿ
  else if (ord(c) = $D9) then result:=chr($C5)+chr($B8) // Ÿ
  else if (ord(c) = $DA) then result:=chr($E2)+chr($81)+chr($84) // /
  else if (ord(c) = $DB) then result:=chr($E2)+chr($82)+chr($AC) // €
  else if (ord(c) = $DC) then result:=chr($E2)+chr($80)+chr($B9) // ‹
  else if (ord(c) = $DD) then result:=chr($E2)+chr($80)+chr($BA) // ›
  else if (ord(c) = $DE) then result:=chr($EF)+chr($AC)+chr($81) // ?
  else if (ord(c) = $DF) then result:=chr($EF)+chr($AC)+chr($82) // ?
  else if (ord(c) = $E0) then result:=chr($E2)+chr($80)+chr($A1) // ‡
  else if (ord(c) = $E1) then result:=chr($C2)+chr($B7) // ·
  else if (ord(c) = $E2) then result:=chr($E2)+chr($80)+chr($9A) // ‚
  else if (ord(c) = $E3) then result:=chr($E2)+chr($80)+chr($9E) // „
  else if (ord(c) = $E4) then result:=chr($E2)+chr($80)+chr($B0) // ‰
  else if (ord(c) = $E5) then result:=chr($C3)+chr($82) // Â
  else if (ord(c) = $E6) then result:=chr($C3)+chr($8A) // Ê
  else if (ord(c) = $E7) then result:=chr($C3)+chr($81) // Á
  else if (ord(c) = $E8) then result:=chr($C3)+chr($8B) // Ë
  else if (ord(c) = $E9) then result:=chr($C3)+chr($88) // È
  else if (ord(c) = $EA) then result:=chr($C3)+chr($8D) // Í
  else if (ord(c) = $EB) then result:=chr($C3)+chr($8E) // Î
  else if (ord(c) = $EC) then result:=chr($C3)+chr($8F) // Ï
  else if (ord(c) = $ED) then result:=chr($C3)+chr($8C) // Ì
  else if (ord(c) = $EE) then result:=chr($C3)+chr($93) // Ó
  else if (ord(c) = $EF) then result:=chr($C3)+chr($94) // Ô
  else if (ord(c) = $F0) then result:=chr($EE)+chr($80)+chr($9E) // ?
  else if (ord(c) = $F1) then result:=chr($C3)+chr($92) // Ò
  else if (ord(c) = $F2) then result:=chr($C3)+chr($9A) // Ú
  else if (ord(c) = $F3) then result:=chr($C3)+chr($9B) // Û
  else if (ord(c) = $F4) then result:=chr($C3)+chr($99) // Ù
  else if (ord(c) = $F5) then result:=chr($C4)+chr($B1) // i
  else if (ord(c) = $F6) then result:=chr($CB)+chr($86) // ˆ
  else if (ord(c) = $F7) then result:=chr($CB)+chr($9C) // ˜
  else if (ord(c) = $F8) then result:=chr($C2)+chr($AF) // ¯
  else if (ord(c) = $F9) then result:=chr($CB)+chr($98) // ?
  else if (ord(c) = $FA) then result:=chr($CB)+chr($99) // ?
  else if (ord(c) = $FB) then result:=chr($CB)+chr($9A) // °
  else if (ord(c) = $FC) then result:=chr($C2)+chr($B8) // ¸
  else if (ord(c) = $FD) then result:=chr($CB)+chr($9D) // ?
  else if (ord(c) = $FE) then result:=chr($CB)+chr($9B) // ?
  else if (ord(c) = $FF) then result:=chr($CB)+chr($87) // ?
  else result:=c;
end;

// Export d'une string

function readString(ssf:subsubfile):string;
var data:array[0..65535] of char;
    s:string;
    i:word;

begin
  seek(SRFhandler,ssf.fileoffset);
  blockread(SRFhandler,data,ssf.filesize);
  s:='';
  for i:=0 to ssf.filesize-1 do begin
    if (data[i] <> #00) then s:=s+MactoUTF8(data[i]);
  end;
  result:=s;
end;

procedure exportStringToFile(ssf:subsubfile;filename:string);
var f:system.text;

begin
  assignfile(f,filename+'.js');
  rewrite(f);
  writeln(f,'res[''string'']='''+readString(ssf)+'''};');
  closefile(f);
end;

// Export d'une stringlist séparée par des zéros

function exportStringlist(ssf:subsubfile):string;
var data:array[0..65535] of char;
    js,s:string;
    i:word;

begin
  js:='';
  seek(SRFhandler,ssf.fileoffset);
  blockread(SRFhandler,data,ssf.filesize);
  s:='';
  for i:=0 to ssf.filesize-1 do begin
    if (data[i] <> #00) then begin
      s:=s+MactoUTF8(data[i]);
    end else begin
      if (s <> '') then begin
        if (js <> '') then js:=js+',';
        js:=js+''''+s+'''';
        s:='';
      end;
    end;
  end;
  js:='['+js+']';
  exportStringlist:=js;
end;

// Export d'une stringlist séparée par des zéros (2eme méthode)

function exportStringlist1(ssf:subsubfile):string;
var data:array[0..65535] of char;
    js,s:string;
    i,nbw:word;

begin
  js:='';
  seek(SRFhandler,ssf.fileoffset);
  blockread(SRFhandler,data,ssf.filesize);
  s:='';
  i:=2;
  nbw:=ord(data[1]);
  while (i < ssf.filesize) and (nbw > 0) do begin
    if (data[i] <> #00) then begin
      s:=s+MactoUTF8(data[i]);
    end else begin
      if (s <> '') then begin
        if (js <> '') then js:=js+',';
        js:=js+''''+s+'''';
        s:='';
        dec(nbw);
      end;
    end;
    inc(i);
  end;
  js:='['+js+']';
  exportStringlist1:=js;
end;

// Export d'une stringlist avec nombre de mots et taille de chaine

function exportStringlist2(ssf:subsubfile):string;
var data:array[0..65535] of char;
    js,s:string;
    i,j,nbstr,strlength:word;

begin
  js:='[';
  seek(SRFhandler,ssf.fileoffset);
  blockread(SRFhandler,data,ssf.filesize);
  nbstr:=ord(data[0])*$FF+ord(data[1]);
  s:='';
  i:=2;
  while nbstr > 0 do begin
    strlength:=ord(data[i]);inc(i);
    for j:=1 to strlength do begin
      s:=s+MactoUTF8(data[i]);inc(i);
    end;
    js:=js+''''+s+'''';
    if (nbstr > 1) then js:=js+',';
    s:='';
    dec(nbstr);
  end;
  js:=js+']';
  exportStringlist2:=js;
end;

// Export des réponses

function exportAnswers(ssf:subsubfile):string;
var data:array[0..65535] of byte;
    js:string;
    i:word;
    nbans:longint;

begin
  js:='[';
  seek(SRFhandler,ssf.fileoffset);
  blockread(SRFhandler,data,ssf.filesize);
  nbans:=data[0]*$FFFFFF+data[1]*$FFFF+data[2]*$FF+data[3];
  i:=4;
  while nbans > 0 do begin
    js:=js+inttostr(data[i]);inc(i);
    if (nbans > 1) then js:=js+',';
    dec(nbans);
  end;
  js:=js+']';
  exportAnswers:=js;
end;

// Export des QHDR

procedure exportQHeadersToFile(ssf:subsubfile);
var data:array[0..65535] of char;
    id,title,filename,force:string;
    i:word;
    value,qtype,qsubtype,answer:byte;

begin
  seek(SRFhandler,ssf.fileoffset);
  blockread(SRFhandler,data,ssf.filesize);
  id:='';
  for i:=2 to 5 do begin
    id:=id+MactoUTF8(data[i]);
  end;
  value:=ord(data[8]);
  qtype:=ord(data[9]);
  qsubtype:=ord(data[11]);
  title:='';
  for i:=16 to 80 do begin
    if (data[i] <> #00) then begin
      title:=title+MactoUTF8(data[i]);
    end else break;
  end;
  filename:='';
  for i:=81 to 145 do begin
    if (data[i] <> #00) then begin
      filename:=filename+MactoUTF8(data[i]);
    end else break;
  end;
  answer:=ord(data[146]);
  force:='';
  if (ssf.filesize >= 152) then for i:=150 to 152 do begin
    if (data[i] <> #00) then begin
      force:=force+MactoUTF8(data[i]);
    end else break;
  end;
  qhdrCSV:=qhdrCSV+'¾'+id+'¾½¾'+title+'¾½¾'+filename+'¾½¾'+inttostr(qtype)+'¾½¾'+inttostr(qsubtype)+'¾½¾'+inttostr(value)+'¾½¾'+inttostr(answer)+'¾½¾'+force+'¾'+#10;
end;

function filetype(ftype:string):string;
begin
  result:='';
  if (ftype='off4') then result:='subimages';
  if (ftype='snd') then result:='subsound';
  if (ftype[1]='M') and (ftype <> 'Mtch') then result:='subsound';
  if (ftype='STR') then result:='string';
  if (ftype='STRL') then result:='stringlist';
  if (ftype='Wrds') then result:='stringlist1';
  // Utilisés pour le Couci-Couça, entre autres
  if (ftype='ANS#') then result:='answers';
  if (ftype='STR#') then result:='stringlist2';
  if (ftype='qhdr') then result:='qheaders'; 
end;

// Lecture du fichier SRF

function openSRF(filename:string):shortint;
var buf:array[0..3] of byte;
    headersize,currentpos:longint;
    i,subcount:longword;
begin
  closeSRF;
  assignfile(SRFhandler,filename);
  FileMode := fmOpenRead;
  reset(SRFhandler,1);
  blockread(SRFhandler,buf,4);
  if (buf[0] <> $73) and (buf[1] <> $72) and (buf[2] <> $66) and (buf[3] <> $31) then begin // srf1
    closeSRF;
    result:=-1;
    exit;
  end;
  SRFdata.loaded:=true;
  readlw; // archivesize
  headersize:=readlw;

  SRFdata.nbfiles:=0;
  while filepos(SRFhandler) < headersize do with SRFdata.filelist[SRFdata.nbfiles] do begin
    blockread(SRFhandler,buf,4);
    subcount:=readlw;
    ftype:=chr(buf[0])+chr(buf[1])+chr(buf[2])+chr(buf[3]);
    while ftype[length(ftype)] = ' ' do delete(ftype,length(ftype),1);
    nbsub:=subcount;
    if (nbsub > 1000) then raise Exception.create('Too many subfiles');
    if (subcount > 0) then for i:=0 to subcount-1 do begin
      subfile[i].subname:=readlw;
      subfile[i].fileoffset:=readlw;
      subfile[i].filesize:=readlw;
      currentpos:=filepos(SRFhandler);
      seek(SRFhandler,subfile[i].fileoffset);
      if (filetype(ftype)='subimages') then begin
        subfile[i].data:=openSubimages(subfile[i].filesize);
      end else if (filetype(ftype)='subsound') then begin
        subfile[i].data:=openSubsound(subfile[i].filesize);
      end else begin
        subfile[i].data:=nil;
      end;
      seek(SRFhandler,currentpos);
    end;
    inc(SRFdata.nbfiles);
    if (SRFdata.nbfiles > 255) then raise Exception.Create('Too many nbfiles'); 
  end;
  result:=0;
end;

function idfileoff4:word;
var i:word;
begin
  result:=9999;  // Oui, drôle de n° de code d'erreur, mais bon, on est en unsigned...
  if (SRFdata.nbfiles > 0) then
    for i:=0 to SRFdata.nbfiles-1 do if (SRFdata.filelist[i].ftype = 'off4') then result:=i;
end;

procedure closeSRF;
var i,j:word;
begin
  if SRFdata.loaded then closefile(SRFhandler);
  if (SRFdata.nbfiles > 0) then for i:=0 to SRFdata.nbfiles-1 do begin
    if (SRFdata.filelist[i].nbsub > 0) then for j:=0 to SRFdata.filelist[i].nbsub-1 do Freemem(SRFdata.filelist[i].subfile[j].data);
  end;
  SRFdata.nbfiles:=0;
  SRFdata.loaded:=false;
end;

begin
  InitColors;
  SRFdata.loaded:=false;
  closeSRF;
end.
