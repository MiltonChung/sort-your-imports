import * as vscode from "vscode";
import {
  sortInsideEditorOnKey,
  sortInsideEditorOnSelected,
} from "./sortInsideEditor";
import {
  configure,
  disableFileWatcher,
  isFileJavascript,
  isFileTypescript,
} from "./util";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "sort-your-imports" is now active!'
  );

  const sortOnKey = vscode.commands.registerCommand(
    "sort-your-imports.sortMyImportsOnKey",
    () => {
      if (isFileJavascript() || isFileTypescript()) {
        if (sortInsideEditorOnKey()) {
          vscode.window.showInformationMessage("Sorted your imports!");
        } else {
          vscode.window.showErrorMessage(
            "Sorry, something went wrong! Could not sort your imports."
          );
        }
      }
    }
  );

  const sortOnSelected = vscode.commands.registerCommand(
    "sort-your-imports.sortMyImportsOnSelected",
    () => {
      if (isFileJavascript() || isFileTypescript()) {
        if (sortInsideEditorOnSelected()) {
          vscode.window.showInformationMessage("Sorted your imports!");
        } else {
          vscode.window.showErrorMessage(
            "Sorry, something went wrong! Could not sort your imports."
          );
        }
      }
    }
  );

  const configurationWatcher =
    vscode.workspace.onDidChangeConfiguration(configure);
  configure();

  context.subscriptions.push(sortOnKey, sortOnSelected, configurationWatcher);
}

export function deactivate() {
  disableFileWatcher();
}
