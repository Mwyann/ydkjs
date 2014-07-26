unit Unit1;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, StdCtrls, ExtCtrls;

type
  TForm1 = class(TForm)
    PaintBox1: TPaintBox;
    Label1: TLabel;
    Label3: TLabel;
    ComboBox1: TComboBox;
    Button3: TButton;
    Label6: TLabel;
    Button4: TButton;
    SRFList: TComboBox;
    Bevel1: TBevel;
    Label2: TLabel;
    Label4: TLabel;
    Label5: TLabel;
    Edit1: TEdit;
    Edit2: TEdit;
    Button1: TButton;
    Memo1: TMemo;
    procedure Button3Click(Sender: TObject);
    procedure ComboBox1Change(Sender: TObject);
    procedure FormShow(Sender: TObject);
    procedure Button4Click(Sender: TObject);
    procedure Button1Click(Sender: TObject);
  private
    { Déclarations privées }
  public
    { Déclarations publiques }
  end;

var
  Form1: TForm1;

implementation

{$R *.dfm}

uses YDKJUnit;

var SRFbasedir,resbasedir:string;

procedure TForm1.Button3Click(Sender: TObject);
var i:word;
    off4:^subimages;
begin
  openSRF(SRFbasedir+SRFList.Items[SRFList.ItemIndex]);
  ComboBox1.Items.Clear;
  if (idfileoff4 < 9999) then begin
  off4:=SRFdata.filelist[idfileoff4].subfile[0].data;
  if off4^.nbimages > 0 then begin
    for i:=0 to off4^.nbimages-1 do begin
      ComboBox1.Items.Add(inttostr(i));
    end;
  end;
  ComboBox1.Enabled:=true;
  ComboBox1.ItemIndex:=0;
  end;
  Button4.Enabled:=true;
end;

var graphic:array[0..307200] of byte;
    picture:array[0..307200] of longint;

procedure TForm1.ComboBox1Change(Sender: TObject);
var pos, graphlen: longint;
    pic:TPicture;
    x,y:word;
    w,h:word;
    off4:^subimages;
begin
  off4:=SRFdata.filelist[idfileoff4].subfile[0].data;
  seek(SRFhandler,off4^.images[ComboBox1.ItemIndex].offset);
  w:=off4^.images[ComboBox1.ItemIndex].width;
  h:=off4^.images[ComboBox1.ItemIndex].height;
  blockread(SRFhandler,graphic,307200,graphlen);
  decodeImageBuffer(graphic,picture,w*h);

  // Dessin à partir de longbitmap
  pic:=TPicture.Create;
  pic.Bitmap.Width:=PaintBox1.Width;
  pic.Bitmap.Height:=PaintBox1.Height;
  x:=0;
  y:=0;
  pos:=0;
  Label1.Caption:='';
  while y < h do begin
    pic.Bitmap.Canvas.Pixels[x,y] := picture[pos];
    inc(pos);
    inc(x);
    if (x >= w) then begin
      x:=0;
      inc(y);
    end;
  end;
  PaintBox1.Canvas.CopyRect(pic.Bitmap.Canvas.ClipRect, pic.Bitmap.Canvas, PaintBox1.Canvas.ClipRect);
end;

function RemoveBaseDir(basedir,s:string):string;
begin
  if copy(s,1,length(basedir)) = basedir then result:=copy(s,length(basedir)+1,255)
  else result:=s;
end;

function IncludeTrailingBackSlash2(s:string):string;
begin
  if s[length(s)] <> '\' then s:=s+'\';
  result:=s;
end;

function RemoveExt(s:string):string;
var ns:string;
begin
  ns:=s;
  while (length(ns) > 0) and (ns[length(ns)] <> '.') do delete(ns,length(ns),1);
  delete(ns,length(ns),1);
  if (length(ns) > 0) then result:=ns else result:=s;
end;

procedure FileSearch(const dirName:string);
var
  searchResult: TSearchRec;
begin
  if FindFirst(dirName+'\*', faAnyFile, searchResult)=0 then begin
    try
      repeat
        if (searchResult.Attr and faDirectory)=0 then begin
          if SameText(ExtractFileExt(searchResult.Name), '.SRF') then begin
            form1.SRFList.Items.Append(RemoveBaseDir(SRFbasedir,IncludeTrailingBackSlash2(dirName)+searchResult.Name));
          end;
        end else if (searchResult.Name<>'.') and (searchResult.Name<>'..') then begin
          FileSearch(IncludeTrailingBackSlash2(dirName)+searchResult.Name);
        end;
      until FindNext(searchResult)<>0
    finally
      FindClose(searchResult);
    end;
  end;
end;

procedure TForm1.FormShow(Sender: TObject);
begin
  resbasedir:=IncludeTrailingBackSlash2('html\res');
  //SRFbasedir:=IncludeTrailingBackSlash2('archives\JACK Demo\FR\Riviera');
  SRFbasedir:=IncludeTrailingBackSlash2('.');
  FileSearch(SRFbasedir);
  //FileSearch('.');
  SRFList.ItemIndex:=0;
end;

function SafeFileName(filename:string):string;
var i:word;
begin
  i:=length(filename)-1;
  while (i>0) do begin
    if (filename[i] = '\') and (filename[i+1] = '\') then delete(filename,i,1);
    dec(i);
  end;
  result:=filename;
end;

function removespaces(s:string):string;
var t:string;
    i:word;
begin
  t:='';
  for i:=1 to length(s) do begin
    if (s[i] <> ' ') then if (s[i] = '#') then t:=t+'0' else t:=t+s[i];
  end;
  result:=t;
end;

procedure TForm1.Button4Click(Sender: TObject);
var filepos,subpos:word;
    fullname,ftype:string;
    strings:string;
    f:system.text;
begin
  strings:='';
  if SRFdata.nbfiles > 0 then for filepos:=0 to SRFdata.nbfiles-1 do begin
    ftype:=SRFdata.filelist[filepos].ftype;
    // if (filetype(ftype)='string') then // Considérer que c'est une liste de chaines, à exporter en un seul fichier JS

    if SRFdata.filelist[filepos].nbsub > 0 then for subpos:=0 to SRFdata.filelist[filepos].nbsub-1 do begin
      if (filetype(ftype)<>'string') then begin
        fullname:=RemoveExt(SafeFileName(GetCurrentDir()+'\'+resbasedir+SRFList.Items[SRFList.ItemIndex]))+'\'+removespaces(ftype);
        ForceDirectories(fullname);
        fullname:=fullname+'\'+inttostr(SRFdata.filelist[filepos].subfile[subpos].subname);
        if (filetype(ftype)='subimages') then begin
          exportSubimagesToGif(SRFdata.filelist[filepos].subfile[subpos],fullname);
        end else if (filetype(ftype)='subsound') then begin
          exportSubsoundToFile(SRFdata.filelist[filepos].subfile[subpos],fullname);
        end else if (filetype(ftype)='string') then begin
          //exportStringToFile(SRFdata.filelist[filepos].subfile[subpos],fullname);
        end else if (filetype(ftype)='stringlist') then begin
          exportStringlistToFile(SRFdata.filelist[filepos].subfile[subpos],fullname);
        end;
      end else begin
        strings:=strings+'{id:'+inttostr(SRFdata.filelist[filepos].subfile[subpos].subname)+',str:'''+readString(SRFdata.filelist[filepos].subfile[subpos])+'''},';
      end;
    end;
  end;

  if (strings <> '') then begin
    fullname:=RemoveExt(SafeFileName(GetCurrentDir()+'\'+resbasedir+SRFList.Items[SRFList.ItemIndex]));
    ForceDirectories(fullname);
    fullname:=fullname+'\STR.js';
    assignfile(f,fullname);
    rewrite(f);
    write(f,'res[''STR'']=['+strings+'];');
    closefile(f);
  end;

  Label1.Caption:='Conversion complete.';
end;

procedure convertSRF(filefrom:string);
var filepos,subpos:word;
    fullname,ftype:string;
    strings:string;
//    f:system.text;
begin
  try
  openSRF(filefrom);
  if SRFdata.nbfiles > 0 then for filepos:=0 to SRFdata.nbfiles-1 do begin
    ftype:=SRFdata.filelist[filepos].ftype;
    // if (filetype(ftype)='string') then // Considérer que c'est une liste de chaines, à exporter en un seul fichier JS

    if SRFdata.filelist[filepos].nbsub > 0 then for subpos:=0 to SRFdata.filelist[filepos].nbsub-1 do begin
      if (filetype(ftype)<>'string') then begin
        fullname:=RemoveExt(SafeFileName(Form1.Edit2.Text+'\'+RemoveBaseDir(Form1.Edit1.Text,filefrom)))+'\'+removespaces(ftype);
        ForceDirectories(fullname);
        fullname:=fullname+'\'+inttostr(SRFdata.filelist[filepos].subfile[subpos].subname);
        if (filetype(ftype)='subimages') then begin
          exportSubimagesToGif(SRFdata.filelist[filepos].subfile[subpos],fullname);
        end else if (filetype(ftype)='subsound') then begin
          exportSubsoundToFile(SRFdata.filelist[filepos].subfile[subpos],fullname);
        end else if (filetype(ftype)='string') then begin
          //exportStringToFile(SRFdata.filelist[filepos].subfile[subpos],fullname);
        end else if (filetype(ftype)='stringlist') then begin
          exportStringlistToFile(SRFdata.filelist[filepos].subfile[subpos],fullname);
        end;
      end else begin
        strings:=strings+'{id:'+inttostr(SRFdata.filelist[filepos].subfile[subpos].subname)+',str:'''+readString(SRFdata.filelist[filepos].subfile[subpos])+'''},';
      end;
    end;
  end;
  except
    Form1.Memo1.Lines.Add('Couldn''t open.');
  end;
  try
    closeSRF;
  except
  end;
end;

procedure convertRecursive(const dirName:string);
var
  searchResult: TSearchRec;
begin
  if FindFirst(dirName+'\*', faAnyFile, searchResult)=0 then begin
    try
      repeat
        if (searchResult.Attr and faDirectory)=0 then begin
          if SameText(ExtractFileExt(searchResult.Name), '.SRF') then begin
            Form1.Memo1.Lines.Add(IncludeTrailingBackSlash2(dirName)+searchResult.Name);
            convertSRF(IncludeTrailingBackSlash2(dirName)+searchResult.Name);
          end;
        end else if (searchResult.Name<>'.') and (searchResult.Name<>'..') then begin
          convertRecursive(IncludeTrailingBackSlash2(dirName)+searchResult.Name);
        end;
      until FindNext(searchResult)<>0
    finally
      FindClose(searchResult);
    end;
  end;
end;

procedure TForm1.Button1Click(Sender: TObject);
begin
   Memo1.Clear;
   convertRecursive(Edit1.Text);
end;

end.
