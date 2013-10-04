## An OpenType, TrueType, and WOFF parser in JavaScript

This is a pure JavaScript parser for font files. It supports the two main formats: OpenType and TrueType as well as WOFF.

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

This roughly corresponds to all the metadata available in most fonts. Future versions of this library will probably support parsing the actual font data (pull requests welcome!). 

## Usage

Use Grunt to compile a minimized versions:

    $ grunt

Then include `build/opentype.js` into your page and pass the `opentype.parse` method an `ArrayBuffer` instance:

    var buffer = new ArrayBuffer(...);

    var font = opentype.parse(buffer);

The `font` variable will now contain a JSON representation of all supported OpenType tables. Later versions of this library will support parsing only select OpenType tables.

## Browser Support

This library extensively uses `ArrayBuffer`'s, and `DataView`'s so you will need a browser that supports those. Any recent version of Chrome or Firefox will do.

## Copyright and License

This library is licensed under the three-clause BSD license. Copyright 2013 Bram Stein. All rights reserved.
