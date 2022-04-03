import * as options from "./options";
import { NamedImport, TypescriptImport } from "./types";

const writeImports = (importClauses: TypescriptImport[]): string => {
  if (importClauses && importClauses.length) {
    return importClauses.map(getImportClauseString).join("\n") + "\n";
  } else {
    return "";
  }
};

const getImportClauseString = (importClause: TypescriptImport): string => {
  const path = getPath(importClause);
  const semicolon = !options.getOmitSemicolon() ? ";" : "";

  if (importClause.namespace) {
    return `import * as ${importClause.namespace} from ${path}${semicolon}`;
  } else if (importClause.default) {
    if (importClause.namedImports) {
      return `import ${importClause.default}, ${generatedNamedImportGroup(
        importClause.namedImports
      )} from ${path}${semicolon}`;
    } else {
      return `import ${importClause.default} from ${path}${semicolon}`;
    }
  } else if (importClause.namedImports) {
    return `import ${generatedNamedImportGroup(
      importClause.namedImports
    )} from ${path}${semicolon}`;
  } else {
    return `import ${path}${semicolon}`;
  }
};

const getPath = (importClause: TypescriptImport): string => {
  const quote = options.getQuoteToken();
  return `${quote}${importClause.path}${quote}`;
};

const generatedNamedImportGroup = (namedImports: NamedImport[]): string => {
  const generatedNamedImports = namedImports.map(generateNamedImport);
  const maxImportsPerSingleLine =
    options.getMaxNamedImportsPerSingleLine() as number;
  if (generatedNamedImports.length > maxImportsPerSingleLine) {
    const newline = `\n${options.getTabString()}`;
    return `{${newline}${generatedNamedImports.join(`,${newline}`)}${newline}}`;
  } else {
    return `{ ${generatedNamedImports.join(", ")} }`;
  }
};

const generateNamedImport = (namedImport: NamedImport): string => {
  if (namedImport.alias) {
    return `${namedImport.importName} as ${namedImport.alias}`;
  } else {
    return namedImport.importName;
  }
};

export { writeImports };
