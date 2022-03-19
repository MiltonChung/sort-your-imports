import * as vscode from "vscode";
import { sortInsideEditor } from "./sortInsideEditor";
import { isFileJavascript, isFileTypescript } from "./util";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "sort-your-imports" is now active!'
  );

  let sort = vscode.commands.registerCommand(
    "sort-your-imports.sortMyImports",
    () => {
      vscode.window.showInformationMessage(
        "Hello World from sort-your-imports!"
      );

      if (isFileJavascript() || isFileTypescript()) {
        sortInsideEditor();
      }
    }
  );

  context.subscriptions.push(sort);
}

export function deactivate() {}
