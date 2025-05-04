import * as vscode from "vscode";
import createDebug from "debug";

const debugConfig = createDebug("cursor-rules:config");

/**
 * Get the configured repositories from the workspace configuration
 * @returns An array of repository URLs
 */
export function getConfiguredRepos(): string[] {
  const config = vscode.workspace.getConfiguration();

  const inspectRepos = config.inspect("cursorRules.repos");

  debugConfig("Global value: %O", inspectRepos?.globalValue);
  debugConfig("Workspace value: %O", inspectRepos?.workspaceValue);
  debugConfig("Default value: %O", inspectRepos?.defaultValue);

  const repos =
    (inspectRepos?.workspaceValue as string[]) ||
    (inspectRepos?.globalValue as string[]) ||
    (inspectRepos?.defaultValue as string[]);

  return repos;
}
