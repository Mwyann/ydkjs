object Form1: TForm1
  Left = 245
  Top = 136
  BorderIcons = [biSystemMenu, biMinimize]
  BorderStyle = bsSingle
  Caption = 'Form1'
  ClientHeight = 556
  ClientWidth = 666
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
    Width = 32
    Height = 13
    Caption = 'Label1'
  end
  object Label2: TLabel
    Left = 16
    Top = 24
    Width = 32
    Height = 13
    Caption = 'Label2'
  end
  object Label3: TLabel
    Left = 288
    Top = 48
    Width = 47
    Height = 13
    Caption = 'Decoded:'
  end
  object Label5: TLabel
    Left = 16
    Top = 40
    Width = 32
    Height = 13
    Caption = 'Label5'
  end
  object Label6: TLabel
    Left = 456
    Top = 32
    Width = 18
    Height = 13
    Caption = 'off4'
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
    Caption = 'Convert to GIF'
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
end
