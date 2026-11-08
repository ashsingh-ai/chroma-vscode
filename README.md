# Chroma — VS Code Title Bar Color Picker

Instantly color-code each VS Code window's title bar. One click, no config.

## Why

Working on multiple projects in VS Code — with several windows open at the same time — means they all look the same. Finding the right window slows you down.

Chroma lets you select and apply a title bar color to each of your VS Code windows. No configuration. No settings files. Just click the Chroma icon in your status bar, pick a color, and you're done.

## Features

- Native color picker (macOS, Windows, Linux)
- Per-workspace — each project keeps its own color
- Status bar icon updates to match your chosen color
- Reset to default anytime

## Install

### From VS Code Marketplace
Search **"Chroma"** in the Extensions panel, or install from the [Marketplace page](https://marketplace.visualstudio.com/items?itemName=ashsingh-ai.titlebar-color-picker).

### From VSIX (manual)
1. Download the `.vsix` from [Gumroad](https://wolfxweb.gumroad.com/l/chroma)
2. Open VS Code → `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows)
3. Type **"Install from VSIX"** → select the downloaded file
4. Reload VS Code when prompted

## Usage

1. Click the **🎨 Chroma** icon in the status bar (bottom right)
2. Pick a color from the native color picker
3. Title bar updates instantly — saved per workspace

To reset: `Cmd+Shift+P` → **"Chroma: Reset to Default"**

## Platforms

| Platform | Color Picker |
|----------|-------------|
| macOS | Native (osascript) |
| Windows | Native (PowerShell ColorDialog) |
| Linux | Hex input box |

## License

MIT
