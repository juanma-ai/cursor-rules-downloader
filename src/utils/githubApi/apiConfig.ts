import { workspace } from "vscode";
import { GitHubApiOptions } from "./types";

/**
 * Get the GitHub API options
 * @param useToken - Whether to use a GitHub token
 * @returns The GitHub API options
 */
export function getGitHubApiOptions(useToken = false): GitHubApiOptions {
  const headers: GitHubApiOptions["headers"] = {
    accept: "application/vnd.github.v3+json",
  };

  if (useToken) {
    const config = workspace.getConfiguration("cursorRules");
    const token = config.get<string>("githubToken");
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
  }

  return { headers };
}
