# Sort Your Imports

Sort your import statements easily by just pressing a key! Sorting options include but not limited to: import line length, variable name, import path, etc...

Link to marketplace: https://marketplace.visualstudio.com/items?itemName=Mewton.sort-your-imports

Supports: JavaScript and TypeScript

## Features

You can sort your imports by:

1. Using the shortcut key f10
2. Select the lines you want to sort, then right click and click 'Sort my imports: sort selected imports'

There are different sorting options:

- Sort by line length(default)
- Sort by variable name
- Sort by import path(namespace, default, named imports)
- Sort by path(relative level)
- Sort naturally(alphabetically but groups multi-digit numbers together)
- Sort by random(shuffle)

## Extension Settings

You can change some of the settings in the extension settings.

This extension contributes the following settings:

- `myExtension.sortBy`: Different sorting methods for your import sorting needs. Sorting by line length is the default.
  - "lineLength",
  - "lineLengthReverse",
  - "variableLength",
  - "variableLengthReverse",
  - "path",
  - "importName",
  - "natural",
  - "shuffle"
- `myExtension.removeDuplicates`: Remove duplicate imports when sorting your imports.
- `myExtension.removeEmptyLines`: Remove empty lines when sorting your imports(only available in sort selected imports option).
- `myExtension.sortOnSave`:Automatically sort your imports when saving a file.
- `myExtension.omitSemicolon`: If set to true, the trailing semicolon will be omitted.
- `myExtension.quoteStyle`: The type of quotation mark to use. single(default) or double.
- `myExtension.getMaxNamedImportsPerSingleLine`: The number of named imports to allow on a single line. If a single import has more than this number, they will be broken up onto separate lines.
- `myExtension.pathSortOrdering`: An array describing the order in which imports should be sorted by paths. Only applicable if sort by is set to path.
  1. package - Any import path that does not begin with '.'
  2. relativeUpLevel - Any import path that begins with '../'
  3. relativeDownLevel - Any import path that begins with './

## Intentions

I always find myself reorganizing my import statements by length because it just looks nicer that way. I built this extension to make that easier with that in mind. Then I wanted to add different sorting options in case other people want to sort their imports by something else.

## Release Notes

### 0.0.1 - 0.0.5

Initial release of Sort My Imports
