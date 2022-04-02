import * as options from "./options";
import { TypescriptImport } from "./types";
import {
  comparePath,
  compareCaseInsensitive,
  compareImportType,
  compareLineLength,
  compareLineLengthReverse,
  compareVariableLength,
  compareVariableLengthReverse,
} from "./sortingAlgorithms";

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
  return temp;
};

const compareImportClauses = (
  a: TypescriptImport,
  b: TypescriptImport
): number => {
  if (options.getSortBy() === "path") {
    return comparePath(a, b);
  } else if (options.getSortBy() === "importName") {
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
  } else if (options.getSortBy() === "variableLength") {
    return compareVariableLength(a, b);
  } else if (options.getSortBy() === "variableLengthReverse") {
    return compareVariableLengthReverse(a, b);
  } else if (options.getSortBy() === "lineLength") {
    return compareLineLength(a, b) || compareCaseInsensitive(a.path, b.path);
  } else if (options.getSortBy() === "lineLengthReverse") {
    return (
      compareLineLengthReverse(a, b) || compareCaseInsensitive(a.path, b.path)
    );
  } else {
    return 0;
  }
};

export { processImports };
