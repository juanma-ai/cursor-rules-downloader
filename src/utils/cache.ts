import * as vscode from "vscode";

/**
 * A singleton class for caching data in the global state
 */
export class Cache {
  private static instance: Cache;
  private context: vscode.ExtensionContext;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  static getInstance(context: vscode.ExtensionContext): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache(context);
    }
    return Cache.instance;
  }

  async set<T>(key: string, data: T): Promise<void> {
    await this.context.globalState.update(key, data);
  }

  get<T>(key: string): T | null {
    return this.context.globalState.get<T>(key) || null;
  }
}
