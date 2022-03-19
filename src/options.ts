import * as vscode from "vscode";

export function getTabString(
  editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor
) {
  if (editor?.options.insertSpaces) {
    return new Array((editor.options.tabSize as number) + 1).join(" ");
  } else {
    return "\t";
  }
}

export function getMaxNamedImportsPerSingleLine() {
  return getExtensionConfig().get("maxNamedImportsInSingleLine");
}

export function getSortOption() {
  return getExtensionConfig().get("sortMethod");
}

export function getQuoteToken() {
  switch (getExtensionConfig().get("quoteStyle")) {
    case "double":
      return '"';
    case "single":
    default:
      return "'";
  }
}

export function shouldSortOnSave(): boolean {
  return getExtensionConfig().get("sortOnSave") as boolean;
}

export function getPathSortOrdering(): string[] {
  return getExtensionConfig().get("pathSortOrder") as string[];
}

export function getOmitSemicolon(): boolean {
  return getExtensionConfig().get("omitSemicolon") as boolean;
}

function getExtensionConfig() {
  console.log(vscode.workspace.getConfiguration("sortMyImports"));
  return vscode.workspace.getConfiguration("sortMyImports");
}
