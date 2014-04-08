unit YDKJUnit;

interface

uses Graphics;

type subimages=record
       subname:longword;
       fps1,fps2:word;
       nbframes:word;
       frames:array[0..2500] of record
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

var SRFhandler:file;
    off4:array[0..200] of subimages;
    nboff4:word;

function openSRF(filename:string):shortint;
procedure exportSubimagesToGif(si:subimages;filename:string);

procedure decodeImageBuffer(buf:array of byte; var bufresult:array of longint; buflen:longint);

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
  //form1.Label2.Caption:='';
  //form1.Label5.Caption:='';
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
    //if (form1.Label2.Caption = '') then form1.Label5.Caption:='Last bitfield in raw before diff: '+inttostr(pos);
    widebf:=buf[pos];inc(pos);
    widebf:=(widebf shl 1) or 1;
    while (widebf and $FF) <> 0 do begin
      //if (l >= 524) and (form1.Label2.Caption = '') then form1.Label2.Caption:='Raw filepos: '+inttostr(pos);
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

// Lecture du format off4

function openSubimages(subname,fileoffset,filesize:longint):subimages;
var si:subimages;
    imagestartpointer,currentpos,currentpos2:longint;
    nbimages,i,j:word;
    nbframes,frameoffset:word;

    val1:byte;
    offsetx,offsety:smallint;
    sizex,sizey:word;
    nbframeimages:word;
begin
  si.subname:=subname;
  currentpos:=filepos(SRFhandler);
  seek(SRFhandler,fileoffset);
  // Spécifique aux images à partir de maintenant
  imagestartpointer:=readlw;
  // Données d'animation
  si.fps1:=readw; // 400
  si.fps2:=readw; // 6   400/6 = 66, 66 ms par frame ?
  nbframes:=readw;
  si.nbframes:=nbframes;
  for i:=0 to nbframes-1 do begin
    frameoffset:=readw;
    if (frameoffset = 0) then begin
      si.frames[i].nbimages:=0;
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
      si.frames[i].nbimages:=nbframeimages;
      si.frames[i].images[0].val1:=val1;
      si.frames[i].images[0].offsetx:=offsetx;
      si.frames[i].images[0].offsety:=offsety;
      si.frames[i].images[0].sizex:=sizex;
      si.frames[i].images[0].sizey:=sizey;
      if (nbframeimages > 0) then for j:=1 to nbframeimages do begin
        readb; // imgnum mais on l'a avec j de toutes façons
        si.frames[i].images[j].val1:=readb;
        si.frames[i].images[j].offsetx:=readw;
        si.frames[i].images[j].offsety:=readw;
        si.frames[i].images[j].sizex:=readw;
        si.frames[i].images[j].sizey:=readw;
        si.frames[i].images[j].imgindex:=readw;
      end;
      seek(SRFhandler,currentpos2);
    end;
  end;

  // Liste d'images
  seek(SRFhandler,fileoffset+imagestartpointer);
  nbimages:=readw;
  if (nbimages <> readw) then begin // Présent deux fois dans le fichier, pourquoi...
    //form1.Label2.caption:='Alert nbimage different';
  end;
  si.nbimages:=nbimages;
  if nbimages > 0 then begin // On peut n'avoir aucune image, mais des frames... exemple avec 5QDemo.srf, premier bloc
    for i:=0 to nbimages-1 do begin
      si.images[i].offset:=fileoffset+readlw;
      si.images[i].width:=readw;
      si.images[i].height:=readw;
    end;
  end;
  seek(SRFhandler,currentpos);
  result:=si;
end;

// Lecture d'un subfile, en fonction du type

procedure openSubfile(t:string;id:longword);
var subname,fileoffset,filesize:longint;

begin
  subname:=readlw;
  fileoffset:=readlw;
  filesize:=readlw;
  if (t='off4') then begin
    off4[id]:=openSubimages(subname,fileoffset,filesize);
    if (id > nboff4) then nboff4:=id;
  end;
end;

// Lecture d'un fichier SRF

function openSRF(filename:string):shortint;
var buf:array[0..3] of byte;
    headersize:longint;
    i,subcount:longword;
begin
  assignfile(SRFhandler,filename);
  reset(SRFhandler,1);
  blockread(SRFhandler,buf,4);
  if (buf[0] <> $73) and (buf[1] <> $72) and (buf[2] <> $66) and (buf[3] <> $31) then begin // srf1
    result:=-1;
    exit;
  end;
  readlw; // archivesize
  headersize:=readlw;
  //form1.Label1.Caption:='Archive size: '+inttostr(archivesize)+' ; Header size: '+inttostr(headersize);
  nboff4:=0;

  while filepos(SRFhandler) < headersize do begin
    blockread(SRFhandler,buf,4);
    subcount:=readlw;
    for i:=0 to subcount-1 do begin
      openSubfile(chr(buf[0])+chr(buf[1])+chr(buf[2])+chr(buf[3]),i);
    end;
  end;
  result:=0;
end;

begin
  InitColors;
end.
