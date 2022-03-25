import * as options from "./options";
import { TypescriptImport } from "./types";

// Compare Import Line Length ==================================================
export const compareLineLength = (
  a: string | TypescriptImport,
  b: string | TypescriptImport
): number => {
  if (typeof a === "string" && typeof b === "string") {
    // Use Array.from so that multi-char characters count as 1 each
    const aLength = Array.from(a).length;
    const bLength = Array.from(b).length;
    if (aLength === bLength) {
      return 0;
    }

    return aLength > bLength ? 1 : -1;
  } else {
    return a.length - b.length;
  }
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

// Compare Case Insensitive ==================================================
export const compareCaseInsensitive = (a: string, b = ""): number => {
  return a.localeCompare(b, "en", { sensitivity: "base" });
};
