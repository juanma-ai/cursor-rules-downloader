import createDebug from "debug";

const debugUrl = createDebug("cursor-rules:url");

/**
 * Get the raw GitHub URL from a given URL
 * @param url - The URL to convert
 * @returns The raw GitHub URL or the original URL if conversion fails
 */
export function getRawGithubUrl(url: string): string {
  try {
    const urlObj = new URL(url);

    // Handle if it's already a raw URL
    if (urlObj.hostname === "raw.githubusercontent.com") {
      return url;
    }

    // Handle API URL conversion
    if (urlObj.hostname === "api.github.com") {
      // Extract the components from the API URL
      const parts = urlObj.pathname.split("/");
      const owner = parts[2];
      const repo = parts[3];
      const path = parts.slice(5).join("/");

      return `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/${path}`;
    }

    // Handle regular GitHub URL
    const parts = urlObj.pathname.split("/");
    const owner = parts[1];
    const repo = parts[2];
    const path = parts.slice(4).join("/");

    return `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/main/${path}`;
  } catch (error) {
    console.error("Error converting to raw URL:", error);
    return url; // Return original URL if conversion fails
  }
}

/**
 * Get the identifier for a repository from a given URL
 * @param url - The URL to convert
 * @returns The identifier for the repository
 */
export function getRepoIdentifier(url: string): string {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "github.com") {
      // Extract owner/repo from github.com URLs
      const parts = urlObj.pathname.split("/");
      const owner = parts[1];
      const repo = parts[2];
      return `${owner}/${repo}`;
    } else if (urlObj.hostname === "api.github.com") {
      // Extract owner/repo from api.github.com URLs
      const parts = urlObj.pathname.split("/");
      const owner = parts[2];
      const repo = parts[3];
      return `${owner}/${repo}`;
    } else if (urlObj.hostname === "raw.githubusercontent.com") {
      // Extract owner/repo from raw.githubusercontent.com URLs
      const parts = urlObj.pathname.split("/");
      const owner = parts[1];
      const repo = parts[2];
      return `${owner}/${repo}`;
    }
    return "unknown-repository";
  } catch {
    return "invalid-url";
  }
}

/**
 * Convert a GitHub URL to an API URL
 * @param githubUrl - The GitHub URL to convert
 * @returns The API URL or null if the URL is invalid
 */
export function convertGithubUrlToApi(githubUrl: string): string | null {
  try {
    const url = new URL(githubUrl);

    // If it's already an API URL, return it
    if (url.hostname === "api.github.com") {
      return githubUrl;
    }

    // Handle github.com URLs
    if (url.hostname === "github.com") {
      const pathParts = url.pathname.split("/").filter(Boolean);

      // We need at least owner/repo
      if (pathParts.length < 2) {
        console.error("Invalid GitHub URL format - need at least owner/repo");
        return null;
      }

      const [owner, repo, ...rest] = pathParts;

      // Handle tree/blob/raw paths
      let path = "";
      if (rest.length > 0) {
        const treeIndex = rest.indexOf("tree");
        const blobIndex = rest.indexOf("blob");
        const startIndex = Math.max(treeIndex, blobIndex);

        if (startIndex !== -1 && rest.length > startIndex + 1) {
          // Skip the 'tree' or 'blob' part and the branch name
          path = rest.slice(startIndex + 2).join("/");
          debugUrl("Path after tree/blob: %s", path);
        } else {
          path = rest.join("/");
          debugUrl("Path without tree/blob: %s", path);
        }
      }

      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      debugUrl("Converting URL: %O", {
        githubUrl,
        pathParts,
        owner,
        repo,
        path,
        apiUrl,
      });
      return apiUrl;
    }

    console.error("Not a GitHub URL");
    return null;
  } catch (error) {
    console.error("Error converting GitHub URL:", error);
    return null;
  }
}
