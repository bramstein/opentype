## DEPRECATED: An OpenType font parser in JavaScript

*This package is deprecated, please use [OpenType.js](https://opentype.js.org/), [Fontkit](https://github.com/foliojs/fontkit), or [lib-font](https://github.com/Pomax/lib-font) instead.*

This is a pure JavaScript parser for OpenType font files. It supports fonts with CFF and TrueType outlines, and can read fonts wrapped as WOFF and WOFF2.

The following OpenType tables are currently supported:

* CMAP (only format 0, 4, 12, and 13)
* head
* hhea
* maxp
* hmtx
* name
* OS/2
* post
* GSUB (excluding LookupType 5, 6, 7, and 8)
* GDEF (only the Glyph Class Definitions)
* gasp

This roughly corresponds to all the metadata available in most fonts. I'm hoping to add support for glyf, CFF, and related tables time permitting.

## Usage

```
npm install opentype
```

```
var opentype = require('opentype');
var fs = require('fs');

fs.readFile('font.otf', function (err, data) {
  var font = opentype.parse(data);
});

```

## Copyright and License

This library is licensed under the three-clause BSD license. Copyright 2013-2016 Bram Stein. All rights reserved.
