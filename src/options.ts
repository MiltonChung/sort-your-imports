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

export function getOmitSemicolon(): boolean {
  return getExtensionConfig().get("omitSemicolon") as boolean;
}

export const getSortEntireFile = (): boolean => {
  return getExtensionConfig().get("sortEntireFile") as boolean;
};

// Currently using
export const getSortBy = (): string => {
  return getExtensionConfig().get("sortBy") as string;
};

export function getPathSortOrdering(): string[] {
  return getExtensionConfig().get("pathSortOrdering") as string[];
}

export const getRemoveDuplicatesOption = (): boolean => {
  return getExtensionConfig().get("removeDuplicates") as boolean;
};

export const getRemoveEmptyLines = (): boolean => {
  return getExtensionConfig().get("removeEmptyLines") as boolean;
};

function getExtensionConfig() {
  return vscode.workspace.getConfiguration("sortMyImports");
}
