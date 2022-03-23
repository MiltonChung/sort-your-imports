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
      (a.namespace && compareCaseInsensitive(a.namespace, b.namespace || "")) ||
      (a.default && compareCaseInsensitive(a.default, b.default || "")) ||
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

// Compare Line Length
const compareLineLength = (a: TypescriptImport, b: TypescriptImport): number =>
  a.length - b.length;

// Compare Case Insensitive
const compareCaseInsensitive = (a: string, b = ""): number => {
  return a.localeCompare(b, "en", { sensitivity: "base" });
};

// Compare Path
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

// Compare Imporr Type
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

// function makeSorter(algorithm?: SortingAlgorithm): ArrayTransformer {
//   return function (lines: string[]): string[] {
//     return lines.sort(algorithm);
//   };
// }

// function sortActiveSelection(
//   transformers: ArrayTransformer[]
// ): Thenable<boolean> | undefined {
//   const textEditor = vscode.window.activeTextEditor;
//   if (!textEditor) {
//     return undefined;
//   }
//   const selection = textEditor.selection;

//   if (
//     selection.isEmpty &&
//     vscode.workspace.getConfiguration("sortLines").get("sortEntireFile") ===
//       true
//   ) {
//     return sortLines(
//       textEditor,
//       0,
//       textEditor.document.lineCount - 1,
//       transformers
//     );
//   }

//   if (selection.isSingleLine) {
//     return undefined;
//   }
//   return sortLines(
//     textEditor,
//     selection.start.line,
//     selection.end.line,
//     transformers
//   );
// }

// function sortLines(
//   textEditor: vscode.TextEditor,
//   startLine: number,
//   endLine: number,
//   transformers: ArrayTransformer[]
// ): Thenable<boolean> {
//   let lines: string[] = [];
//   for (let i = startLine; i <= endLine; i++) {
//     lines.push(textEditor.document.lineAt(i).text);
//   }

//   // Remove blank lines in selection
//   if (
//     vscode.workspace.getConfiguration("sortLines").get("filterBlankLines") ===
//     true
//   ) {
//     removeBlanks(lines);
//   }

//   lines = transformers.reduce(
//     (currentLines, transform) => transform(currentLines),
//     lines
//   );

//   return textEditor.edit((editBuilder) => {
//     const range = new vscode.Range(
//       startLine,
//       0,
//       endLine,
//       textEditor.document.lineAt(endLine).text.length
//     );
//     editBuilder.replace(range, lines.join("\n"));
//   });
// }

// function removeBlanks(lines: string[]): void {
//   for (let i = 0; i < lines.length; ++i) {
//     if (lines[i].trim() === "") {
//       lines.splice(i, 1);
//       i--;
//     }
//   }
// }

// function lineLengthCompare(a: string, b: string): number {
//   // Use Array.from so that multi-char characters count as 1 each
//   const aLength = Array.from(a).length;
//   const bLength = Array.from(b).length;
//   if (aLength === bLength) {
//     return 0;
//   }
//   return aLength > bLength ? 1 : -1;
// }

// const sortLineLength = () =>
//   sortActiveSelection([makeSorter(lineLengthCompare)]);
