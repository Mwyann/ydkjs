object Form1: TForm1
  Left = 245
  Top = 136
  Width = 1061
  Height = 583
  Caption = 'Form1'
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
  object Image1: TImage
    Left = 672
    Top = 64
    Width = 369
    Height = 265
  end
  object Label1: TLabel
    Left = 672
    Top = 336
    Width = 32
    Height = 13
    Caption = 'Label1'
  end
  object Label2: TLabel
    Left = 672
    Top = 352
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
  object Label4: TLabel
    Left = 848
    Top = 48
    Width = 38
    Height = 13
    Caption = 'Original:'
  end
  object Label5: TLabel
    Left = 672
    Top = 368
    Width = 32
    Height = 13
    Caption = 'Label5'
  end
  object Label6: TLabel
    Left = 568
    Top = 16
    Width = 18
    Height = 13
    Caption = 'off4'
  end
  object Button1: TButton
    Left = 272
    Top = 16
    Width = 75
    Height = 25
    Caption = 'Try to decode'
    TabOrder = 0
    OnClick = Button1Click
  end
  object Button2: TButton
    Left = 824
    Top = 16
    Width = 75
    Height = 25
    Caption = 'BMP to raw'
    TabOrder = 1
    OnClick = Button2Click
  end
  object ComboBox1: TComboBox
    Left = 592
    Top = 16
    Width = 73
    Height = 21
    Enabled = False
    ItemHeight = 13
    TabOrder = 2
    OnChange = ComboBox1Change
  end
  object Button3: TButton
    Left = 480
    Top = 16
    Width = 75
    Height = 25
    Caption = 'Open SRF'
    TabOrder = 3
    OnClick = Button3Click
  end
  object Button4: TButton
    Left = 680
    Top = 16
    Width = 75
    Height = 25
    Caption = 'Convert to GIF'
    Enabled = False
    TabOrder = 4
    OnClick = Button4Click
  end
end
