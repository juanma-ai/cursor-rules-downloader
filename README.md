# Cursor Rules Downloader

[![Visual Studio Marketplace Version](https://img.shields.io/vscode-marketplace/v/juanmaguitar.custom-cursor-rules-multirepo.svg?label=VSCode%20Marketplace&color=blue)](https://marketplace.visualstudio.com/items?itemName=juanmaguitar.custom-cursor-rules-multirepo)
[![Visual Studio Marketplace Downloads](https://img.shields.io/vscode-marketplace/d/juanmaguitar.custom-cursor-rules-multirepo.svg?label=Downloads&color=green)](https://marketplace.visualstudio.com/items?itemName=juanmaguitar.custom-cursor-rules-multirepo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Main Features

- Support for configurable repository sources via `cursorRules.repos` setting
  - Repository order in settings determines the order of rules in the Command Palette

```
"cursorRules.repos": [
    "https://github.com/juanma-ai/my-cursor-rules/tree/main/.cursor/rules"
  ]
```

> [!NOTE]
> Any repo added to `cursorRules.repos` must have its rules available at a `.cursor/rules` folder of the repo. Cursor rules under that folder should also have the `*.mdc` extension.

- Source indicator in QuickPick UI showing which repository each rule comes from
- Download fetched rules from remote repos directly into the `.cursor/rules` folder of your project
- Enhanced error handling and typescript definitions

## Usage

- Open the command palette (Cmd+Shift+P or Ctrl+Shift+P) and type "Cursor Rules Multirepo: Add .cursor/rules".

![](./images/1-download-cursorrule.gif)

- If a `.cursorrule` is detected you can overwrite the existing one or append the selected one to the existing one

![](./images/2-append-cursorrule.gif)

## Development

### Debugging

This extension uses the `debug` package for debug logging. All logs are namespaced with `cursor-rules:*`.

To filter logs when developing, set the DEBUG environment variable:

```bash
# Show all logs
DEBUG=cursor-rules:* npm run watch

# Show only content logs
DEBUG=cursor-rules:content npm run watch

# Show multiple components
DEBUG=cursor-rules:content,cursor-rules:file npm run watch

# Exclude certain logs
DEBUG=cursor-rules:*,-cursor-rules:cache npm run watch
```

Available namespaces:

- `cursor-rules:init` - Initialization logs
- `cursor-rules:content` - Content handling logs
- `cursor-rules:file` - File operation logs
- `cursor-rules:url` - URL processing logs
- `cursor-rules:fetcher` - API fetching logs
- `cursor-rules:cache` - Cache operation logs
- `cursor-rules:config` - Configuration logs
- `cursor-rules:command` - Command execution logs

## Contributing

- Fork the repository.
- Create a new branch.
- Make your changes and test locally.
- Submit a pull request and wait for approval.

## Credits

This extension is based on the original work by [BeilunYang](https://github.com/beilunyang). Original repository: [vscode-cursor-rules](https://github.com/beilunyang/vscode-cursor-rules)

## License

[MIT License](LICENSE).
