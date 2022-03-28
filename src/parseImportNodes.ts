import * as vscode from "vscode";
import * as options from "./options";
import { DestructedImport, TypescriptImport } from "./types";

const name = `((?!\\d)(?:(?!\\s)[$\\w\\u0080-\\uFFFF]|\\\\u[\\da-fA-F]{4}|\\\\u\\{[\\da-fA-F]+\\})+)`;
const ws = `[\\s\\n\\r]`;

const namespaceToken = `\\*\\s+as\\s+(${name})`;
const defaultImportToken = name;
const destructingImportToken = `(${name})(\\s+as\\s+(${name}))?`;
const destructingImport = `{(${ws}*${destructingImportToken}(,${ws}*${destructingImportToken})*${ws}*)}`;
const defaultAndDestructingImport = `${defaultImportToken}${ws}*,${ws}*${destructingImport}`;
const combinedImportTypes = `(${namespaceToken}|${defaultImportToken}|${destructingImport}|${defaultAndDestructingImport})`;
const importRegexString = `^import\\s+(${combinedImportTypes}\\s+from\\s+)?['"]([@\\w\\\\/\.-]+)['"];?\\r?\\n?`;

// Group 5 || Group 18 - default import
// Group 3 - namespace import
// Group 6 || Group 19 - destructing import group; requires further tokenizing
// Group 31 - file path or package
const importRegex = new RegExp(importRegexString, "gm");

const parseKeyImports = (document: vscode.TextDocument): TypescriptImport[] => {
  const source = document.getText();
  importRegex.lastIndex = 0;
  const imports: TypescriptImport[] = [];

  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(source)) !== null) {
    imports.push({
      path: match[31],
      default: match[5] || match[18],
      namedImports: parseDestructiveImports(match[6] || match[19]),
      namespace: match[3],
      range: new vscode.Range(
        document.positionAt(match.index),
        document.positionAt(importRegex.lastIndex)
      ),
      length: importRegex.lastIndex - match.index,
      text: match[0],
    });
  }

  return imports;
};

const parseSelectedImports = (
  editor: vscode.TextEditor,
  startLine: vscode.TextLine,
  endLine: vscode.TextLine
): TypescriptImport[] => {
  importRegex.lastIndex = 0;
  const imports: TypescriptImport[] = [];

  const textRange = new vscode.Range(startLine.range.start, endLine.range.end);
  const text = editor.document.getText(textRange);

  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(text)) !== null) {
    imports.push({
      path: match[31],
      default: match[5] || match[18],
      namedImports: parseDestructiveImports(match[6] || match[19]),
      namespace: match[3],
      range: new vscode.Range(
        editor.document.positionAt(match.index),
        editor.document.positionAt(importRegex.lastIndex)
      ),
      length: importRegex.lastIndex - match.index,
      text: match[0],
    });
  }

  return imports;
};

// Group 1 - importName
// Group 4 - alias
const destructingImportTokenRegex = new RegExp(destructingImportToken);

const parseDestructiveImports = (
  destructiveImports: string
): DestructedImport[] | undefined => {
  if (!destructiveImports) {
    return undefined;
  }

  return destructiveImports.split(",").map((destructiveImport) => {
    let match = destructingImportTokenRegex.exec(destructiveImport);
    return {
      importName: match![1],
      alias: match![4],
    };
  });
};

export { parseKeyImports, parseSelectedImports };
