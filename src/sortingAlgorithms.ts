import * as options from "./options";
import { TypescriptImport } from "./types";

// Compare Import variable length ==================================
export const compareVariableLengthReverse = (
  a: TypescriptImport,
  b: TypescriptImport
): number => {
  return compareVariableLength(a, b) * -1;
};

export const compareVariableLength = (
  a: TypescriptImport,
  b: TypescriptImport
): number => {
  return compareLineLength(
    getVariableCharacters(a.text),
    getVariableCharacters(b.text)
  );
};

export const getVariableCharacters = (line: string): string => {
  const match = line.match(/(.*)=/);
  if (!match) {
    return line;
  }
  const last = match.pop();
  if (!last) {
    return line;
  }
  return last;
};

// Compare Import Line Length Reverse ==================================================
export const compareLineLengthReverse = (
  a: TypescriptImport,
  b: TypescriptImport
): number => {
  return compareLineLength(a, b) * -1;
};

// Compare Import Line Length ==================================================
export const compareLineLength = (
  a: TypescriptImport | string,
  b: TypescriptImport | string
): number => {
  if (typeof a === "string" && typeof b === "string") {
    const aLength = Array.from(a).length;
    const bLength = Array.from(b).length;
    if (aLength === bLength) {
      return 0;
    }
    return aLength > bLength ? 1 : -1;
  }

  return a.length - b.length;
};

// Compare Import Type ==================================================
export const compareImportType = (
  a: TypescriptImport,
  b: TypescriptImport
): number => {
  return getImportTypePriority(a) - getImportTypePriority(b);
};

const getImportTypePriority = (importClause: TypescriptImport): number => {
  if (importClause.namespace) {
    return 0;
  } else if (importClause.default) {
    return 1;
  } else if (importClause.namedImports) {
    return 2;
  } else {
    return 3;
  }
};

// Compare Path ==================================================
export const comparePath = (
  a: TypescriptImport,
  b: TypescriptImport
): number => {
  return getPathPriority(a.path) - getPathPriority(b.path);
};

const getPathPriority = (path: string): number => {
  let sortOrder = options.getPathSortOrdering();
  if (/^\.\//.test(path)) {
    return sortOrder.indexOf("relativeDownLevel");
  } else if (/^\.\.\//.test(path)) {
    return sortOrder.indexOf("relativeUpLevel");
  } else {
    return sortOrder.indexOf("package");
  }
};

// Sorts alphabetically but groups multi-digit numbers together ==================================================
let intlCollator: Intl.Collator;
export const naturalCompare = (
  a: TypescriptImport,
  b: TypescriptImport
): number => {
  if (!intlCollator) {
    intlCollator = new Intl.Collator(undefined, { numeric: true });
  }
  return intlCollator.compare(a.text, b.text);
};

// Compare Case Insensitive ==================================================
export const compareCaseInsensitive = (a: string, b = ""): number => {
  return a.localeCompare(b, "en", { sensitivity: "base" });
};

// Remove duplicate imports ==================================================
export const removeDuplicates = (
  lines: string[] | TypescriptImport[]
): string[] | TypescriptImport[] => {
  if (instanceOfTypescriptImport(lines)) {
    const hi = lines.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.text === value.text)
    );
    console.log({ hi });
    return hi;
  } else {
    return Array.from(new Set(lines));
  }
};

const instanceOfTypescriptImport = (
  object: any
): object is TypescriptImport[] => {
  return "text" in object[0];
};

// Remove empty lines ==================================================
export const removeEmptyLines = (lines: string[]): string[] => {
  let tempLines = [...lines];
  for (let i = 0; i < tempLines.length; ++i) {
    if (tempLines[i].trim() === "") {
      tempLines.splice(i, 1);
      i--;
    }
  }

  return tempLines;
};

// Sort lines shuffled ==================================================
export const shuffleSorter = (
  lines: string[] | TypescriptImport[]
): string[] | TypescriptImport[] => {
  if (instanceOfTypescriptImport(lines)) {
    for (let i = lines.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [lines[i].text, lines[rand].text] = [lines[rand].text, lines[i].text];
    }
  } else {
    for (let i = lines.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[rand]] = [lines[rand], lines[i]];
    }
  }
  return lines;
};
