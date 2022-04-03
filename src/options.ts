import * as vscode from "vscode";

export const getTabString = (
  editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor
): string => {
  if (editor?.options.insertSpaces) {
    return new Array((editor.options.tabSize as number) + 1).join(" ");
  } else {
    return "\t";
  }
};

export const getMaxNamedImportsPerSingleLine = (): number => {
  return getExtensionConfig().get("maxNamedImportsInSingleLine") as number;
};

export const getQuoteToken = (): string => {
  switch (getExtensionConfig().get("quoteStyle")) {
    case "double":
      return '"';
    case "single":
    default:
      return "'";
  }
};

export const getOmitSemicolon = (): boolean => {
  return getExtensionConfig().get("omitSemicolon") as boolean;
};

export const getSortBy = (): string => {
  return getExtensionConfig().get("sortBy") as string;
};

export const getPathSortOrdering = (): string[] => {
  return getExtensionConfig().get("pathSortOrdering") as string[];
};

export const getRemoveDuplicatesOption = (): boolean => {
  return getExtensionConfig().get("removeDuplicates") as boolean;
};

export const getRemoveEmptyLines = (): boolean => {
  return getExtensionConfig().get("removeEmptyLines") as boolean;
};

export const shouldSortOnSave = (): boolean => {
  return getExtensionConfig().get("sortOnSave") as boolean;
};

function getExtensionConfig() {
  return vscode.workspace.getConfiguration("sortMyImports");
}
