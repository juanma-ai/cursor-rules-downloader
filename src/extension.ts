import * as vscode from "vscode";
import { addCursorRuleCommand } from "./commands/addCursorRule";
import { Cache } from "./utils/cache";
import createDebug from "debug";

// Initialize debug instances for different modules
const debugInit = createDebug("cursor-rules:init");

export function activate(context: vscode.ExtensionContext) {
  // Log startup information
  debugInit("Extension activating, extension mode: %s", context.extensionMode);

  // Initialize cache
  Cache.getInstance(context);

  // Register commands
  const disposable = vscode.commands.registerCommand(
    "cursorRules.addRule",
    () => {
      return addCursorRuleCommand(context);
    }
  );

  context.subscriptions.push(disposable);
  debugInit("Extension activated successfully");
}

// This function is called when the extension is deactivated
export function deactivate() {
  // Nothing to clean up
}
