import { expect } from "chai";
import * as sinon from "sinon";
import * as vscode from "vscode";
import { activate, deactivate } from "../../extension";
import { Cache } from "../../utils/cache";

// Define a type for the disposable
interface Disposable {
  dispose(): void;
}

describe("Extension", () => {
  let mockContext: vscode.ExtensionContext;
  let registerCommandStub: sinon.SinonStub;
  let cacheGetInstanceStub: sinon.SinonStub;

  beforeEach(() => {
    // Create stub for the Cache.getInstance method
    cacheGetInstanceStub = sinon.stub(Cache, "getInstance");

    // Create a stub for the registerCommand method
    registerCommandStub = sinon.stub();

    // Create mock context with required properties
    mockContext = {
      subscriptions: [],
      workspaceState: {
        get: () => {
          // Mock implementation - intentionally empty
          return undefined;
        },
        update: () => Promise.resolve(),
      },
      globalState: {
        get: () => {
          // Mock implementation - intentionally empty
          return undefined;
        },
        update: () => Promise.resolve(true),
      },
      extensionPath: "/test/extension/path",
      extensionUri: { fsPath: "/test/extension/path" },
      asAbsolutePath: (relativePath: string) =>
        `/test/extension/path/${relativePath}`,
      storagePath: "/test/storage/path",
      globalStoragePath: "/test/global/storage/path",
      logPath: "/test/log/path",
      extensionMode: 1,
      secrets: {
        get: () => Promise.resolve(""),
        store: () => Promise.resolve(),
        delete: () => Promise.resolve(),
      },
    } as unknown as vscode.ExtensionContext;

    // Stub vscode.commands.registerCommand
    sinon
      .stub(vscode.commands, "registerCommand")
      .returns(registerCommandStub as unknown as Disposable);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("activate", () => {
    it("should register the addRule command", () => {
      activate(mockContext);

      expect(cacheGetInstanceStub.calledOnceWith(mockContext)).to.be.true;

      const registerCommandCall = vscode.commands
        .registerCommand as sinon.SinonStub;
      expect(registerCommandCall.calledOnce).to.be.true;
      expect(registerCommandCall.firstCall.args[0]).to.equal(
        "cursorRules.addRule"
      );
      expect(registerCommandCall.firstCall.args[1]).to.be.a("function");

      expect(mockContext.subscriptions).to.have.lengthOf(1);
    });
  });

  describe("deactivate", () => {
    it("should not throw error", () => {
      expect(deactivate).to.not.throw();
    });
  });
});
