import * as vscode from "vscode";
import { sortImports } from "./sortImports";
import { sortSelectedImports } from "./sortSelectedImports";

const sortInsideEditorOnKey = (): boolean => {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const edits: vscode.TextEdit[] = sortImports(editor.document);
    editor.edit((editBuilder) => {
      edits.forEach((edit) => {
        editBuilder.replace(edit.range, edit.newText);
      });
    });
    return true;
  }

  return false;
};

const sortInsideEditorOnClick = (): boolean => {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    sortSelectedImports();
    return true;
  }

  return false;
};

export { sortInsideEditorOnKey, sortInsideEditorOnClick };
