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
  console.log(options.getPathSortOrdering(), "ordering");
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

// Compare Case Insensitive ==================================================
export const compareCaseInsensitive = (a: string, b = ""): number => {
  return a.localeCompare(b, "en", { sensitivity: "base" });
};

// Remove duplicate imports ==================================================
export const removeDuplicates = (lines: string[]): string[] => {
  return Array.from(new Set(lines));
};

export const removeBlanks = (lines: string[]): string[] => {
  let tempLines = [...lines];
  for (let i = 0; i < tempLines.length; ++i) {
    if (tempLines[i].trim() === "") {
      tempLines.splice(i, 1);
      i--;
    }
  }
  return tempLines;
};
