program YDKJ;

uses
  Forms,
  Unit1 in 'Unit1.pas' {Form1},
  GIFImage in 'GifImage.pas',
  YDKJUnit in 'YDKJUnit.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.CreateForm(TForm1, Form1);
  Application.Run;
end.
