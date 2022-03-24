import * as options from "./options";
import * as vscode from "vscode";
import { TypescriptImport } from "./types";
import { ArrayTransformer, SortingAlgorithm } from "./types";

const processImports = (
  importClauses: TypescriptImport[]
): TypescriptImport[] => {
  const temp = importClauses
    .map((importClause) => {
      if (importClause.namedImports) {
        importClause.namedImports.sort((a, b) =>
          a.importName.localeCompare(b.importName, "en", {
            sensitivity: "base",
          })
        );
      }
      return importClause;
    })
    .sort(compareImportClauses);

  console.log(temp);
  return temp;
};

const compareImportClauses = (
  a: TypescriptImport,
  b: TypescriptImport
): number => {
  if (options.getSortOption() === "path") {
    return comparePath(a, b) || compareCaseInsensitive(a.path, b.path);
  } else if (options.getSortOption() === "importName") {
    return (
      compareImportType(a, b) ||
      (a.namespace &&
        b.namespace &&
        compareCaseInsensitive(a.namespace, b.namespace)) ||
      (a.default &&
        b.default &&
        compareCaseInsensitive(a.default, b.default)) ||
      (a.namedImports &&
        b.namedImports &&
        compareCaseInsensitive(
          a.namedImports[0].importName,
          b.namedImports[0].importName
        )) ||
      comparePath(a, b)
    );
  } else {
    return compareLineLength(a, b) || compareCaseInsensitive(a.path, b.path);
  }
};

// Compare Line Length ==============
const compareLineLength = (a: TypescriptImport, b: TypescriptImport): number =>
  a.length - b.length;

// Compare Case Insensitive ==============
const compareCaseInsensitive = (a: string, b = ""): number => {
  return a.localeCompare(b, "en", { sensitivity: "base" });
};

// Compare Path ==============
const comparePath = (a: TypescriptImport, b: TypescriptImport): number => {
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

// Compare Import Type ==============
const compareImportType = (
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

export { processImports };
