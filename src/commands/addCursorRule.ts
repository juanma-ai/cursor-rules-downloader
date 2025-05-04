import * as vscode from "vscode";
import * as githubApi from "../utils/githubApi";
import * as path from "path";
import createDebug from "debug";

const debugCommand = createDebug("cursor-rules:command");
debugCommand("githubApi: %O", githubApi);

const { fetchCursorRulesList, fetchCursorRuleContent } = githubApi;

interface Progress {
  report(value: { increment?: number; message?: string }): void;
}

export async function addCursorRuleCommand(context: vscode.ExtensionContext) {
  try {
    const quickPick = vscode.window.createQuickPick();
    quickPick.placeholder = "Loading...";
    quickPick.show();

    let rules = [];
    try {
      rules = await fetchCursorRulesList(context);
    } catch (error) {
      vscode.window.showErrorMessage("Error loading rules list.");
      quickPick.hide();
      return;
    }

    quickPick.items = rules.map((rule) => ({
      label: rule.name,
      description: `(${rule.source} repository)`,
    }));
    quickPick.placeholder = "Select a rule file";

    const selected = await new Promise<string | undefined>((resolve) => {
      quickPick.onDidAccept(() => {
        const selection = quickPick.selectedItems[0]?.label;
        resolve(selection);
        quickPick.hide();
      });
      quickPick.onDidHide(() => {
        resolve(undefined);
      });
    });

    if (!selected) {
      vscode.window.showInformationMessage("No rules selected.");
      return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage("Please open a workspace first.");
      return;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    const filePath = path.join(workspacePath, ".cursorrules");
    debugCommand("----addCursorRuleCommand");
    debugCommand("Command parameters: %O", {
      filePath,
      selected,
      context,
      workspaceFolders,
      workspacePath,
    });

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Downloading ${selected}...`,
        cancellable: false,
      },
      async (progress: Progress) => {
        await fetchCursorRuleContent(
          selected,
          filePath,
          (percent) => {
            progress.report({ increment: percent });
          },
          context
        );
      }
    );

    vscode.window.showInformationMessage(
      `Rule saved to ${path.join(workspacePath, ".cursor", "rules", selected)}`
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Error adding rule file: ${error}`);
  }
}
