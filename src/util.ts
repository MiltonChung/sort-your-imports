import * as vscode from "vscode";
import { shouldSortOnSave } from "./options";
import { sortInsideEditorOnSave } from "./sortInsideEditor";

export const isFileJavascript = () => {
  return (
    vscode.window.activeTextEditor?.document.languageId === "javascript" ||
    vscode.window.activeTextEditor?.document.languageId === "javascriptreact"
  );
};

export const isFileTypescript = () => {
  return (
    vscode.window.activeTextEditor?.document.languageId === "typescript" ||
    vscode.window.activeTextEditor?.document.languageId === "typescriptreact"
  );
};

const isSupportedLanguage = (languageId: string) => {
  return (
    languageId === "typescript" ||
    languageId === "typescriptreact" ||
    languageId === "javascript" ||
    languageId === "javascriptreact"
  );
};

export const configure = () => {
  if (shouldSortOnSave()) {
    enableFileWatcher();
  } else if (!shouldSortOnSave()) {
    disableFileWatcher();
  }
};

let sortOnSaveDisposer: vscode.Disposable | undefined;

export const enableFileWatcher = () => {
  if (!sortOnSaveDisposer) {
    sortOnSaveDisposer = vscode.workspace.onWillSaveTextDocument(sortOnSave);
  }
};

export const disableFileWatcher = () => {
  if (sortOnSaveDisposer) {
    sortOnSaveDisposer.dispose();
    sortOnSaveDisposer = undefined;
  }
};

export const sortOnSave = (event: vscode.TextDocumentWillSaveEvent) => {
  console.log("sortOnSave");
  if (isSupportedLanguage(event.document.languageId)) {
    event.waitUntil(
      new Promise<vscode.TextEdit[]>((resolve, _) => {
        resolve(sortInsideEditorOnSave(event.document));
      })
    );
  }
};
