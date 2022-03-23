import * as vscode from "vscode";
import { sortImports } from "./sortImports";

const sortInsideEditor = () => {
  let editor = vscode.window.activeTextEditor;

  console.log("beginning", editor);

  if (editor) {
    let edits: vscode.TextEdit[] = sortImports(editor!.document);
    editor.edit((editBuilder) => {
      edits.forEach((edit) => {
        editBuilder.replace(edit.range, edit.newText);
      });
    });
    console.log("5: ", { editor });
    // sortLineLength();
  }
};

export { sortInsideEditor };

// =================================================================================================
