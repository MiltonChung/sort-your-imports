import * as vscode from "vscode";
import { isFileJavascript, isFileTypescript } from "./util";
import {
  sortInsideEditorOnClick,
  sortInsideEditorOnKey,
} from "./sortInsideEditor";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "sort-your-imports" is now active!'
  );

  let sortOnKey = vscode.commands.registerCommand(
    "sort-your-imports.sortMyImportsOnKey",
    () => {
      if (isFileJavascript() || isFileTypescript()) {
        if (sortInsideEditorOnKey()) {
          vscode.window.showInformationMessage("Sorted your imports!");
        } else {
          vscode.window.showErrorMessage("Could not sort your imports!");
        }
      }
    }
  );

  const sortOnClick = vscode.commands.registerCommand(
    "sort-your-imports.sortMyImportsOnClick",
    () => {
      if (isFileJavascript() || isFileTypescript()) {
        if (sortInsideEditorOnClick()) {
          vscode.window.showInformationMessage("Sorted your imports!");
        } else {
          vscode.window.showErrorMessage("Could not sort your imports!");
        }
      }
    }
  );

  context.subscriptions.push(sortOnKey, sortOnClick);
}

export function deactivate() {}
