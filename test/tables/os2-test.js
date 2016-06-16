var os2 = require('../../src/tables/os2');
var expect = require('unexpected');
var c = require('concentrate');

describe('tables.os/2', function () {
  it('reads os/2 table', function () {

    var data = c()
      .uint16be(5)  // version 5
      .int16be(10)  // xAvgCharWidth
      .uint16be(20) // usWeightClass
      .uint16be(30) // usWidthClass
      .uint16be(1)  // fsType
      .int16be(40)  // ySubscriptXSize
      .int16be(50)  // ySubscriptYSize
      .int16be(60)  // ySubscriptXOffset
      .int16be(70)  // ySubscriptYOffset
      .int16be(80)  // ySuperscriptXSize
      .int16be(90)  // ySuperscriptYSize
      .int16be(100) // ySuperscriptXOffset
      .int16be(110) // ySuperscriptYOffset
      .int16be(120) // yStrikeoutSize
      .int16be(130) // yStrikeoutPosition
      .int16be(140) // sFamilyClass
      .uint8(141)   // panose[0]
      .uint8(142)   // panose[1]
      .uint8(143)   // panose[2]
      .uint8(144)   // panose[3]
      .uint8(145)   // panose[4]
      .uint8(146)   // panose[5]
      .uint8(147)   // panose[6]
      .uint8(148)   // panose[7]
      .uint8(149)   // panose[8]
      .uint8(150)   // panose[9]
      .uint32be(160) // ulUnicodeRange1
      .uint32be(170) // ulUnicodeRange2
      .uint32be(180) // ulUnicodeRange3
      .uint32be(190) // ulUnicodeRange4
      .string('FTTB', 'ascii') // achVendID
      .uint16be(200) // fsSelection
      .uint16be(210) // usFirstCharIndex
      .uint16be(220) // usLastCharIndex
      .int16be(230)  // sTypoAscender
      .int16be(240)  // sTypoDescender
      .int16be(250)  // sTypoLineGap
      .uint16be(260) // usWinAscent
      .uint16be(270) // usWinDescent
      .uint32be(280) // ulCodePageRange1
      .uint32be(290) // ulCodePageRange2
      .int16be(300)  // sxHeight
      .int16be(310)  // sCapHeight
      .uint16be(320) // usDefaultChar
      .uint16be(330) // usBreakChar
      .uint16be(340) // usMaxContext
      .uint16be(350) // usLowerOpticalPointSize
      .uint16be(360) // usUpperOpticalPointSize

    expect(os2(data.result()), 'to equal', {
 			version: 5,
			xAvgCharWidth: 10,
			usWeightClass: 20,
			usWidthClass: 30,
			fsType: 1,
			ySubscriptXSize: 40,
			ySubscriptYSize: 50,
			ySubscriptXOffset: 60,
			ySubscriptYOffset: 70,
			ySuperscriptXSize: 80,
			ySuperscriptYSize: 90,
			ySuperscriptXOffset: 100,
			ySuperscriptYOffset: 110,
			yStrikeoutSize: 120,
			yStrikeoutPosition: 130,
			sFamilyClass: 140,
			panose: {
				bFamilyType: 141,
				bSerifStyle: 142,
				bWeight: 143,
				bProportion: 144,
				bContrast: 145,
				bStrokeVariation: 146,
				bArmStyle: 147,
				bLetterform: 148,
				bMidline: 149,
				bXHeight: 150
			},
			ulUnicodeRange1: 160,
			ulUnicodeRange2: 170,
			ulUnicodeRange3: 180,
			ulUnicodeRange4: 190,
			achVendID: 'FTTB',
			fsSelection: 200,
			usFirstCharIndex: 210,
			usLastCharIndex: 220,
			sTypoAscender: 230,
			sTypoDescender: 240,
			sTypoLineGap: 250,
			usWinAscent: 260,
			usWinDescent: 270,
			ulCodePageRange1: 280,
			ulCodePageRange2: 290,
			sxHeight: 300,
			sCapHeight: 310,
			usDefaultChar: 320,
			usBreakChar: 330,
			usMaxContext: 340,
      usLowerOpticalPointSize: 350,
      usUpperOpticalPointSize: 360
		});
  });
});
