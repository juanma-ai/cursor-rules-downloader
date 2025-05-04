import * as fsPromises from "fs/promises";
import * as vscode from "vscode";
import * as path from "path";
import createDebug from "debug";

const debugFile = createDebug("cursor-rules:file");

/**
 * Saves a rule file to the workspace
 * @param workspaceFolder - The workspace folder to save to
 * @param ruleName - The name of the rule file
 * @param content - The content to write to the file
 * @returns The path to the saved file
 */
export async function saveRuleFile(
  workspaceFolder: vscode.WorkspaceFolder,
  ruleName: string,
  content: string
): Promise<string> {
  // Create .cursor/rules directory in the workspace root
  const rulesDir = path.join(workspaceFolder.uri.fsPath, ".cursor", "rules");
  try {
    await fsPromises.mkdir(rulesDir, { recursive: true });
    debugFile("Created rules directory: %s", rulesDir);
  } catch (error) {
    console.error("Error creating rules directory:", error);
    throw new Error("Failed to create rules directory");
  }

  // Save the rule file in the .cursor/rules directory with original name
  const ruleFilePath = path.join(rulesDir, ruleName);
  await fsPromises.writeFile(ruleFilePath, content);
  debugFile("Saved rule file to: %s", ruleFilePath);

  return ruleFilePath;
}
