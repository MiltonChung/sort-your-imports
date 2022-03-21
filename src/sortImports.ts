import * as vscode from "vscode";
import { parseImports } from "./parseImportNodes";
import processImports from "./processImports";
import writeImports from "./writeImports";

const sortImports = (document: vscode.TextDocument) => {
  let imports = parseImports(document);
  console.log("1: ", { imports });

  imports = processImports(imports);
  console.log("2: ", { imports });

  const sortedImportText = writeImports(imports);
  console.log("3: ", { sortedImportText });

  const edits: vscode.TextEdit[] = imports.map(
    (importClause: { range: vscode.Range }) =>
      vscode.TextEdit.delete(importClause.range)
  );
  edits.push(
    vscode.TextEdit.insert(new vscode.Position(0, 0), sortedImportText)
  );
  console.log("4: ", { edits });

  return edits;
};

export { sortImports };
