import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "sort-your-imports" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "sort-your-imports.sortMyImports",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from sort-your-imports!"
      );
      // if (shouldEnableJavascript() && isFileJavascript() ||
      //         isFileTypescript()) {
      //         sortInsideEditor();
      //     }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
