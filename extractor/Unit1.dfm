object Form1: TForm1
  Left = 245
  Top = 136
  BorderIcons = [biSystemMenu, biMinimize]
  BorderStyle = bsSingle
  Caption = 'YDKJ Extractor'
  ClientHeight = 763
  ClientWidth = 673
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'MS Sans Serif'
  Font.Style = []
  OldCreateOrder = False
  OnShow = FormShow
  PixelsPerInch = 96
  TextHeight = 13
  object PaintBox1: TPaintBox
    Left = 16
    Top = 64
    Width = 640
    Height = 480
  end
  object Label1: TLabel
    Left = 16
    Top = 8
    Width = 30
    Height = 13
    Caption = 'Status'
  end
  object Label3: TLabel
    Left = 16
    Top = 48
    Width = 41
    Height = 13
    Caption = 'Preview:'
  end
  object Label6: TLabel
    Left = 456
    Top = 32
    Width = 18
    Height = 13
    Caption = 'off4'
  end
  object Bevel1: TBevel
    Left = 8
    Top = 552
    Width = 657
    Height = 9
  end
  object Label2: TLabel
    Left = 8
    Top = 568
    Width = 71
    Height = 13
    Caption = 'Full conversion'
  end
  object Label4: TLabel
    Left = 24
    Top = 584
    Width = 26
    Height = 13
    Caption = 'From:'
  end
  object Label5: TLabel
    Left = 32
    Top = 608
    Width = 16
    Height = 13
    Caption = 'To:'
  end
  object ComboBox1: TComboBox
    Left = 480
    Top = 32
    Width = 73
    Height = 21
    Enabled = False
    ItemHeight = 13
    TabOrder = 0
    OnChange = ComboBox1Change
  end
  object Button3: TButton
    Left = 368
    Top = 32
    Width = 75
    Height = 25
    Caption = 'Open SRF'
    TabOrder = 1
    OnClick = Button3Click
  end
  object Button4: TButton
    Left = 568
    Top = 32
    Width = 75
    Height = 25
    Caption = 'Convert to res'
    Enabled = False
    TabOrder = 2
    OnClick = Button4Click
  end
  object SRFList: TComboBox
    Left = 368
    Top = 8
    Width = 273
    Height = 21
    Style = csDropDownList
    ItemHeight = 13
    TabOrder = 3
  end
  object Edit1: TEdit
    Left = 64
    Top = 584
    Width = 385
    Height = 21
    TabOrder = 4
    Text = 'J:\Jeux\YDKJ\FullFR'
  end
  object Edit2: TEdit
    Left = 64
    Top = 608
    Width = 385
    Height = 21
    TabOrder = 5
    Text = 'F:\YDKJ\archives\res-full'
  end
  object Button1: TButton
    Left = 464
    Top = 584
    Width = 75
    Height = 25
    Caption = 'Convert all'
    TabOrder = 6
    OnClick = Button1Click
  end
  object Memo1: TMemo
    Left = 8
    Top = 632
    Width = 649
    Height = 121
    TabOrder = 7
  end
end
