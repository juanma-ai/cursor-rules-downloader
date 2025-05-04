import { expect } from "chai";
import * as sinon from "sinon";
import * as vscode from "vscode";
import mockFs from "mock-fs";
import * as fs from "fs/promises";
import * as path from "path";
import { resetCapturedLogs } from "../../mocha-setup";
import { saveRuleFile } from "../../../utils/githubApi";

describe("Filesystem Operations", () => {
  beforeEach(() => {
    resetCapturedLogs();

    // Mock file system with empty workspace
    mockFs({
      "/test-workspace": {},
    });
  });

  afterEach(() => {
    sinon.restore();
    mockFs.restore();
  });

  describe("Directory Creation", () => {
    it("should create .cursor/rules directory if it does not exist", async () => {
      // Arrange
      const rulesDir = path.join("/test-workspace", ".cursor", "rules");
      const ruleName = "example-rule.mdc";
      const ruleContent = "test rule content";
      const expectedPath = path.join(rulesDir, ruleName);

      // Act
      await fs.mkdir(rulesDir, { recursive: true });
      await fs.writeFile(expectedPath, ruleContent);

      // Assert
      const dirExists = await fs
        .access(rulesDir)
        .then(() => true)
        .catch(() => false);
      expect(dirExists).to.be.true;

      const fileExists = await fs
        .access(expectedPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).to.be.true;
    });

    it("should use existing .cursor/rules directory if it exists", async () => {
      // Arrange
      const rulesDir = path.join("/test-workspace", ".cursor", "rules");
      await fs.mkdir(rulesDir, { recursive: true });

      const existingFile = path.join(rulesDir, "existing-rules.mdc");
      await fs.writeFile(existingFile, "existing content");

      const newFile = path.join(rulesDir, "new-rules.mdc");
      const newContent = "new content";

      // Act
      await fs.writeFile(newFile, newContent);

      // Assert
      const existingContent = await fs.readFile(existingFile, "utf-8");
      expect(existingContent).to.equal("existing content");

      const newFileContent = await fs.readFile(newFile, "utf-8");
      expect(newFileContent).to.equal(newContent);
    });

    it("should handle directory creation errors gracefully", async () => {
      // Arrange
      const rulesDir = path.join("/test-workspace", ".cursor", "rules");

      // Mock file system to simulate a read-only directory
      mockFs({
        "/test-workspace": mockFs.directory({
          mode: 0o444, // read-only
          items: {},
        }),
      });

      // Act & Assert
      try {
        await fs.mkdir(rulesDir, { recursive: true });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).to.equal("EACCES");
      }
    });
  });

  describe("Rule File Creation", () => {
    it("should preserve the original filename from the repository when saving", async () => {
      // Arrange
      const rulesDir = path.join("/test-workspace", ".cursor", "rules");
      const ruleName = "example-rule.mdc";
      const ruleContent = "test rule content";
      const expectedPath = path.join(rulesDir, ruleName);

      // Create directory first
      await fs.mkdir(rulesDir, { recursive: true });

      // Act
      await fs.writeFile(expectedPath, ruleContent);

      // Assert
      const fileExists = await fs
        .access(expectedPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).to.be.true;

      const content = await fs.readFile(expectedPath, "utf-8");
      expect(content).to.equal(ruleContent);
    });

    it("should handle duplicate rule names by overwriting", async () => {
      // Arrange
      const rulesDir = path.join("/test-workspace", ".cursor", "rules");
      const ruleName = "example-rule.mdc";
      const originalContent = "original content";
      const newContent = "new content";
      const expectedPath = path.join(rulesDir, ruleName);

      // Create directory first
      await fs.mkdir(rulesDir, { recursive: true });

      // Write original file
      await fs.writeFile(expectedPath, originalContent);

      // Act - Write new file with same name
      await fs.writeFile(expectedPath, newContent);

      // Assert
      const content = await fs.readFile(expectedPath, "utf-8");
      expect(content).to.equal(newContent);
    });

    it("should handle special characters in rule names", async () => {
      // Arrange
      const rulesDir = path.join("/test-workspace", ".cursor", "rules");
      const ruleName = "special@#$%^&-rule.mdc";
      const ruleContent = "test rule content";
      const expectedPath = path.join(rulesDir, ruleName);

      // Create directory first
      await fs.mkdir(rulesDir, { recursive: true });

      // Act
      await fs.writeFile(expectedPath, ruleContent);

      // Assert
      const fileExists = await fs
        .access(expectedPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).to.be.true;

      const content = await fs.readFile(expectedPath, "utf-8");
      expect(content).to.equal(ruleContent);
    });
  });

  describe("saveRuleFile function", () => {
    it("should create directory and save file correctly", async () => {
      // Arrange
      const mockWorkspaceFolder = {
        uri: { fsPath: "/test-workspace" },
      } as vscode.WorkspaceFolder;
      const ruleName = "test-rule.mdc";
      const ruleContent = "test rule content";
      const expectedPath = path.join(
        "/test-workspace",
        ".cursor",
        "rules",
        ruleName
      );

      // Act
      const result = await saveRuleFile(
        mockWorkspaceFolder,
        ruleName,
        ruleContent
      );

      // Assert
      expect(result).to.equal(expectedPath);

      const fileExists = await fs
        .access(expectedPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).to.be.true;

      const content = await fs.readFile(expectedPath, "utf-8");
      expect(content).to.equal(ruleContent);
    });

    it("should throw error when directory creation fails", async () => {
      // Arrange
      const mockWorkspaceFolder = {
        uri: { fsPath: "/test-workspace" },
      } as vscode.WorkspaceFolder;

      // Mock file system to simulate a read-only directory
      mockFs({
        "/test-workspace": mockFs.directory({
          mode: 0o444, // read-only
          items: {},
        }),
      });

      // Act & Assert
      try {
        await saveRuleFile(mockWorkspaceFolder, "rule.mdc", "content");
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).to.include("Failed to create rules directory");
      }
    });
  });
});
