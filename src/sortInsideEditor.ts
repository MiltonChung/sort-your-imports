import * as vscode from "vscode";
import writeImports from "./writeImports";
import { parseKeyImports, parseSelectedImports } from "./parseImportNodes";
import { processImports } from "./processImports";
// import { sortSelectedImports } from "./sortSelectedImports";
import * as options from "./options";

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

/* 
write the imports and push the new edits to the editor
*/
const sortInsideEditorOnClick = (): boolean => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return false;
  }
  const selection = editor.selection;
  let startLine: vscode.TextLine, endLine: vscode.TextLine;

  if (selection.isEmpty && options.getSortEntireFile() === true) {
    startLine = editor.document.lineAt(0);
    endLine = editor.document.lineAt(editor.document.lineCount - 1);
  } else {
    startLine = editor.document.lineAt(selection.start.line);
    endLine = editor.document.lineAt(selection.end.line);
  }

  let imports = parseSelectedImports(editor, startLine, endLine);
  imports = processImports(imports);
  console.log("1", { imports });

  editor.edit((editBuilder) => {
    const range = new vscode.Range(
      startLine.range.start.line,
      0,
      endLine.range.start.line,
      editor.document.lineAt(endLine.range.start.line).text.length
    );

    let lines: string[] = [];

    for (let i = 0; i < imports.length; i++) {
      lines.push(imports[i].text.replace(/(\r\n|\n|\r)/gm, ""));
    }

    console.log("2", {
      lines,
      imports,
      start: startLine.range.start.line,
      end: endLine.range.start.line,
      selection,
    });

    if (
      lines.length !==
      endLine.range.start.line - startLine.range.start.line
    ) {
      vscode.window.showErrorMessage("Please select only import lines");
      return false;
    }
    editBuilder.replace(range, lines.join("\n"));
  });

  return true;
};

export { sortInsideEditorOnKey, sortInsideEditorOnClick };
