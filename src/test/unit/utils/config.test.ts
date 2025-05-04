import { expect } from "chai";
import * as sinon from "sinon";
import * as vscode from "vscode";
import { getConfiguredRepos } from "../../../utils/config";

describe("Config Utilities", () => {
  let configStub: sinon.SinonStub;
  let inspectStub: sinon.SinonStub;

  beforeEach(() => {
    inspectStub = sinon.stub();
    configStub = sinon.stub(vscode.workspace, "getConfiguration").returns({
      inspect: inspectStub,
    } as unknown as vscode.WorkspaceConfiguration);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getConfiguredRepos", () => {
    // Tests that when a workspace-specific configuration exists,
    // it takes precedence over both global and default values
    it("should return workspace value if available", () => {
      const workspaceRepos = ["https://github.com/user1/repo1"];
      inspectStub.returns({
        workspaceValue: workspaceRepos,
        globalValue: ["https://github.com/user2/repo2"],
        defaultValue: ["https://github.com/default/repo"],
      });

      const result = getConfiguredRepos();

      expect(result).to.deep.equal(workspaceRepos);
      expect(configStub.calledOnce).to.be.true;
      expect(inspectStub.calledOnceWith("cursorRules.repos")).to.be.true;
    });

    // Tests that if no workspace-specific configuration exists,
    // the global value is returned if available
    it("should return global value if workspace value is not available", () => {
      const globalRepos = ["https://github.com/user2/repo2"];
      inspectStub.returns({
        workspaceValue: undefined,
        globalValue: globalRepos,
        defaultValue: ["https://github.com/default/repo"],
      });

      const result = getConfiguredRepos();

      expect(result).to.deep.equal(globalRepos);
    });

    it("should return default value if workspace and global values are not available", () => {
      const defaultRepos = ["https://github.com/default/repo"];
      inspectStub.returns({
        workspaceValue: undefined,
        globalValue: undefined,
        defaultValue: defaultRepos,
      });

      const result = getConfiguredRepos();

      expect(result).to.deep.equal(defaultRepos);
    });
  });
});
