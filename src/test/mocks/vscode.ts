/**
 * Mock for the vscode module
 */

// Create storage maps for our mocks
const globalStateStorage = new Map<string, any>();
const workspaceStateStorage = new Map<string, any>();

// Global namespace that would be provided by VS Code
const vscode = {
  workspace: {
    workspaceFolders: [
      {
        uri: { fsPath: "/test-workspace" },
        name: "test-workspace",
        index: 0,
      },
    ],
    getConfiguration: () => ({
      get: (key: string) => {
        if (key === "cursorRules.repos") {
          return ["https://github.com/testuser/testrepo"];
        }
        if (key === "cursorRules.githubToken") {
          return "test-token";
        }
        return undefined;
      },
      inspect: (key: string) => {
        if (key === "cursorRules.repos") {
          return {
            globalValue: ["https://github.com/testuser/testrepo"],
            workspaceValue: undefined,
            defaultValue: ["https://github.com/default/repo"],
          };
        }
        return undefined;
      },
    }),
  },
  window: {
    createQuickPick: () => ({
      placeholder: "",
      show: () => {
        // Mock implementation - intentionally empty
      },
      hide: () => {
        // Mock implementation - intentionally empty
      },
      onDidAccept: (callback: () => void) => {
        callback();
        return {
          dispose: () => {
            // Mock implementation - intentionally empty
          },
        };
      },
      onDidHide: (callback: () => void) => {
        callback();
        return {
          dispose: () => {
            // Mock implementation - intentionally empty
          },
        };
      },
      items: [],
      selectedItems: [],
    }),
    showErrorMessage: () => {
      // Mock implementation - intentionally empty
    },
    showInformationMessage: () => {
      // Mock implementation - intentionally empty
    },
    withProgress: async (
      options: Record<string, unknown>,
      task: (progress: Record<string, unknown>) => Promise<unknown>
    ) => {
      return task({
        report: () => {
          // Mock implementation - intentionally empty
        },
      });
    },
  },
  commands: {
    registerCommand: (/*_command: string, _callback: () => void*/) => {
      return {
        dispose: () => {
          // Mock implementation - intentionally empty
        },
      };
    },
  },
  progressLocation: {
    notification: 1,
  },
  uri: {
    file: (path: string) => ({ fsPath: path }),
  },
  eventEmitter: class {
    event: () => void;
    constructor() {
      this.event = () => {
        // Mock implementation - intentionally empty
      };
    }
    fire(): void {
      // Mock implementation - intentionally empty
    }
  },
  // Custom implementation of Memento interface for testing
  Memento: class {
    private storage: Map<string, any>;

    constructor(storage: Map<string, any>) {
      this.storage = storage;
    }

    get<T>(key: string): T | undefined {
      return this.storage.get(key) as T;
    }

    update(key: string, value: any): Promise<boolean> {
      this.storage.set(key, value);
      return Promise.resolve(true);
    }

    setKeysForSync(/*keys: readonly string[]*/): void {
      // Mock implementation - intentionally empty
    }
  },
  // Add mock for ExtensionContext
  ExtensionContext: class {
    subscriptions: Array<{ dispose(): void }> = [];
    workspaceState: any;
    globalState: any;
    extensionPath = "";
    extensionUri = { fsPath: "" };
    asAbsolutePath = (relativePath: string) => relativePath;
    storagePath = "";
    globalStoragePath = "";
    logPath = "";
    extensionMode = 1;
    secrets = {
      get: (/*key: string*/) => Promise.resolve(""),
      store: (/*key: string, value: string*/) => Promise.resolve(),
      delete: (/*key: string*/) => Promise.resolve(),
    };

    constructor() {
      this.workspaceState = new vscode.Memento(workspaceStateStorage);
      this.globalState = new vscode.Memento(globalStateStorage);
    }
  },
};

export = vscode;
