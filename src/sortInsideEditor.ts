import * as vscode from "vscode";
import writeImports from "./writeImports";
import { parseKeyImports, parseSelectedImports } from "./parseImportNodes";
import { processImports } from "./processImports";
import { sortSelectedImports } from "./sortSelectedImports";

const sortInsideEditorOnKey = (): boolean => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return false;
  }

  let imports = parseKeyImports(editor.document);
  imports = processImports(imports);
  const sortedImportText = writeImports(imports);

  const edits: vscode.TextEdit[] = imports.map(
    (importClause: { range: vscode.Range }) =>
      vscode.TextEdit.delete(importClause.range)
  );

  edits.push(
    vscode.TextEdit.insert(new vscode.Position(0, 0), sortedImportText)
  );

  editor.edit((editBuilder) => {
    edits.forEach((edit) => {
      editBuilder.replace(edit.range, edit.newText);
    });
  });
  return true;
};

const sortInsideEditorOnClick = (): boolean => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return false;
  }
  const selection = editor.selection;

  let imports = parseSelectedImports(selection, editor);
  console.log(imports);
  sortSelectedImports();
  return true;
};

export { sortInsideEditorOnKey, sortInsideEditorOnClick };
