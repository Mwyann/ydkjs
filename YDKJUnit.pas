unit YDKJUnit;

interface

uses Graphics;

type subimages=record
       fps1,fps2:word;
       nbframes:word;
       frames:array[0..3000] of record
         nbimages:word;
         images:array[0..10] of record
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
     end;

type subfile=record
       ftype:string[4]; // off4, snd....
       nbsub:word;
       subfile:array[0..255] of record
         subname:longint;
         fileoffset,filesize:longword;
         data:pointer; // Pointeur qui dépendra du type
       end;
     end;

var SRFhandler:file;
    SRFdata:record
      loaded:boolean;
      nbfiles:word;
      filelist:array[0..255] of subfile;
    end;

function openSRF(filename:string):shortint;
procedure closeSRF;
function filetype(ftype:string):string;
procedure exportSubimagesToGif(si:subimages;filename:string);
procedure exportSubsoundToFile(ss:subsound;filename:string);

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
      end;
      bglength:=-1;
    end else if (pos=nextbg) then begin
      bglength:=bitmap[i];
    end else begin
      bufresult[pos] := colors[bitmap[i]];
      inc(pos);
    end;
  end;
end;

// Export des images/animations en Gif+JS

const verticalGIF = 1; // 1 = GIF en mode vertical, 0 en mode horizontal

procedure exportSubimagesToGif(si:subimages;filename:string);
var GIF:TGifImage;
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

  if si.nbimages > 0 then begin

  for off4pos:=0 to si.nbimages-1 do with si.images[off4pos] do begin
    if (verticalGIF = 1) then begin
      if (width > maxwidth) then maxwidth:=width;
      inc(maxheight,height);
    end else begin
      if (height > maxheight) then maxheight:=height;
      inc(maxwidth,width);
    end;
  end;

  // Dessin à partir de longbitmap
  pic:=TPicture.Create;
  pic.Bitmap.Width:=maxwidth;
  pic.Bitmap.Height:=maxheight;
  pic.Bitmap.Canvas.Brush.Color:=$FF80FF; // Remplir l'image de la couleur transparente
  pic.Bitmap.Canvas.FillRect(pic.Bitmap.Canvas.ClipRect);

  js:=js+'var tiles=new Array();';
  realx:=0;
  realy:=0;
  for off4pos:=0 to si.nbimages-1 do begin
    seek(SRFhandler,si.images[off4pos].offset);
    w:=si.images[off4pos].width;
    h:=si.images[off4pos].height;
    blockread(SRFhandler,graphic,307200,graphlen);
    decodeImageBuffer(graphic,picture,w*h);
    js:=js+'tiles['+inttostr(off4pos)+']={x:'+inttostr(realx)+',y:'+inttostr(realy)+',w:'+inttostr(w)+',h:'+inttostr(h)+'};';
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
    if (verticalGIF = 1) then inc(realy,h) else inc(realx,w);
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

  js:=js+#13#10'var frames=new Array();';
  for i:=0 to si.nbframes-1 do begin
    js:=js+'frames['+inttostr(i)+']={nbimg:'+inttostr(si.frames[i].nbimages);
    if (si.frames[i].nbimages > 0) then begin
      js:=js+',fps1:'+inttostr(si.fps1)+',fps2:'+inttostr(si.fps2)+',img:[';
      for j:=0 to si.frames[i].nbimages do begin
        js:=js+'{'
        +'val:'+inttostr(si.frames[i].images[j].val1)+','
        +'ox:'+inttostr(si.frames[i].images[j].offsetx)+','
        +'oy:'+inttostr(si.frames[i].images[j].offsety)+','
        +'sx:'+inttostr(si.frames[i].images[j].sizex)+','
        +'sy:'+inttostr(si.frames[i].images[j].sizey)+','
        +'idx:'+inttostr(si.frames[i].images[j].imgindex)
        +'},';
      end;
      js:=js+']';
    end;
    js:=js+'};';
  end;

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

    val1:byte;
    offsetx,offsety:smallint;
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
      readb; // imgnum, vaut toujours 0 ici
      val1:=readb;
      offsetx:=readw;
      offsety:=readw;
      sizex:=readw;
      sizey:=readw;
      nbframeimages:=readw;
      si^.frames[i].nbimages:=nbframeimages;
      si^.frames[i].images[0].val1:=val1;
      si^.frames[i].images[0].offsetx:=offsetx;
      si^.frames[i].images[0].offsety:=offsety;
      si^.frames[i].images[0].sizex:=sizex;
      si^.frames[i].images[0].sizey:=sizey;
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
  if nbimages > 0 then begin // On peut n'avoir aucune image, mais des frames... exemple avec 5QDemo.srf, premier bloc
    for i:=0 to nbimages-1 do begin
      si^.images[i].offset:=fileoffset+readlw;
      si^.images[i].width:=readw;
      si^.images[i].height:=readw;
    end;
  end;
  result:=si;
end;

// Export des sons en wav ou aifc

procedure exportSubsoundToFile(ss:subsound;filename:string);
var f:file;
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
    data[38]:=$00;data[39]:=$10;
    data[40]:=$40;data[41]:=$0D;data[42]:=$AF;data[43]:=$C8;data[44]:=$00;data[45]:=$00;data[46]:=$00;data[47]:=$00;
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
    data[24]:=$E4;data[25]:=$57;data[26]:=$00;data[27]:=$00;data[28]:=$C8;data[29]:=$AF;data[30]:=$00;data[31]:=$00;

    data[32]:=$02;data[33]:=$00;data[34]:=$10;data[35]:=$00;data[36]:=ord('d');data[37]:=ord('a');data[38]:=ord('t');data[39]:=ord('a');
    size:=ss.size;
    data[40]:=(size and $FF);data[41]:=(size and $FF00) shr 8;data[42]:=(size and $FF0000) shr 16;data[43]:=(size and $FF000000) shr 24;

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
    samples:longword;
begin
  getmem(ss,sizeof(subsound));

  blockread(SRFhandler,data,42); // Infos inutiles a priori
  samples:=readlw;
  ss.samples:=samples;
  blockread(SRFhandler,data,38); // Compression en 14-17
  ss.offset:=filepos(SRFhandler);
  ss.size:=filesize-84; // Taille totale moins le header

  ss.aifc:=false;

  if (data[14] = 0) and (data[15] = 0) and (data[16] = 0) and (data[17] = 0) then begin // WAV
    ss.aifc:=false;
  end else if (data[14] = $69) and (data[15] = $6D) and (data[16] = $61) and (data[17] = $34) then begin // AIFC (ima4)
    ss.aifc:=true;
  end;

  result:=ss;
end;

function filetype(ftype:string):string;
begin
  result:='';
  if (ftype='off4') then result:='subimages';
  if (ftype='snd ') then result:='subsound';
  if (ftype[1]='M') then result:='subsound';
end;

// Lecture du fichier SRF

function openSRF(filename:string):shortint;
var buf:array[0..3] of byte;
    headersize,currentpos:longint;
    i,subcount:longword;
begin
  closeSRF;
  assignfile(SRFhandler,filename);
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
    nbsub:=subcount;
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
      end;
      seek(SRFhandler,currentpos);
    end;
    inc(SRFdata.nbfiles);
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
