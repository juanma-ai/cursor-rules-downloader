export interface Rule {
  name: string;
  downloadUrl: string;
  source: string;
}

export interface GithubContent {
  name: string;
  path: string;
  downloadUrl: string;
  type: string;
}

export interface GitHubApiOptions {
  headers: {
    authorization?: string;
    accept: string;
  };
}

export const RULES_CACHE_KEY = "cursor_rules_list";
