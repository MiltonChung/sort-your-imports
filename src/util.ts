import * as vscode from "vscode";
// import sortImports from "./sortImports";
// import { shouldSortOnSave } from "./options";
// import isSupportedLanguage from "./isSupportedLanguage";

let sortOnSaveDisposer: vscode.Disposable | undefined;

export function isFileJavascript() {
  return (
    vscode.window.activeTextEditor?.document.languageId === "javascript" ||
    vscode.window.activeTextEditor?.document.languageId === "javascriptreact"
  );
}

export function isFileTypescript() {
  return (
    vscode.window.activeTextEditor?.document.languageId === "typescript" ||
    vscode.window.activeTextEditor?.document.languageId === "typescriptreact"
  );
}

// export function configure() {
//   if (shouldSortOnSave()) {
//     enableFileWatcher();
//   } else if (!shouldSortOnSave()) {
//     disableFileWatcher();
//   }
// }

// export function enableFileWatcher() {
//   if (!sortOnSaveDisposer) {
//     sortOnSaveDisposer = vscode.workspace.onWillSaveTextDocument(sortOnSave);
//   }
// }

// export function disableFileWatcher() {
//   if (sortOnSaveDisposer) {
//     sortOnSaveDisposer.dispose();
//     sortOnSaveDisposer = undefined;
//   }
// }

// export function sortOnSave(event: vscode.TextDocumentWillSaveEvent) {
//   if (isSupportedLanguage(event.document.languageId)) {
//     event.waitUntil(
//       new Promise<vscode.TextEdit[]>((resolve, reject) => {
//         resolve(sortImports(event.document));
//       })
//     );
//   }
// }
