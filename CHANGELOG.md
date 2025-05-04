# Changelog

## 1.0.0 (Initial Release)

## 0.3.0

### Added

- User prompt to choose between appending or overwriting .cursorrules file
- Interactive selection for handling existing rules

## 0.2.0

### Added

- Support for configurable repository sources via `cursorRules.repos` setting
- Repository order in settings now determines the order of rules in the Command Palette
- Improved error handling for invalid repository URLs

### Changed

- Replaced hardcoded repository URLs with configurable ones from settings
- Enhanced GitHub URL parsing to support various URL formats

## 0.1.0

### Fork Information

- Based on [Custom Cursor Rules](https://marketplace.visualstudio.com/items?itemName=beilunyang.cursor-rules) of BeilunYang's

### Added

- Support for fetching rules from two repositories:

  - Official repo: `PatrickJS/awesome-cursorrules`
  - Custom repo: `juanma-ai/my-cursor-rules`

- Source indicator in QuickPick UI showing which repository each rule comes from
- Progress interface for better type safety
- Custom rules now appear first in the selection list
- Added context parameter to `fetchCursorRuleContent` for proper cache access

### Changed

- Updated dependencies and type definitions:

  - Updated @types/axios to ^0.14.4
  - Updated @types/node to ^22.10.1
  - Updated @types/vscode to ^1.95.0

- Modified `tsconfig.json` to include 'dom' lib for console support
- Improved code formatting with consistent double quotes
- Enhanced error handling for repository fetching
- Updated function signatures to properly pass extension context

### Fixed

- Fixed type errors in githubApi.ts and addCursorRule.ts
- Fixed linter errors related to missing type declarations
- Fixed console.error type definition by adding DOM lib
- Fixed progress parameter typing in withProgress calls
- Fixed context access in fetchCursorRuleContent function

### Technical Improvements

- Refactored `fetchCursorRulesList` to handle multiple repositories
- Added proper TypeScript types for Progress interface
- Improved error handling in repository fetching
- Enhanced caching mechanism to handle multiple sources
- Added source tracking for each rule
- Improved cache instance management with proper context handling

### Code Style

- Standardized string quotes to double quotes
- Improved code formatting and indentation
- Added proper type annotations
- Enhanced function signatures with explicit return types

### Development

- Added new type definitions for better development experience
- Updated TypeScript configuration for better type checking
- Improved development tooling with better type support
