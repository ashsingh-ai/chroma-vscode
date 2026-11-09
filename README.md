# Chroma — VS Code Title Bar Color Picker

Instantly color-code each VS Code window's title bar. One click, no config.

**Free on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ashsingh-ai.chroma)** · [GitHub](https://github.com/ashsingh-ai/chroma-vscode) · [Gumroad](https://wolfxweb.gumroad.com/l/chroma)

## Why

Working on multiple projects in VS Code — with several windows open at the same time — means they all look the same. Finding the right window slows you down.

Chroma lets you select and apply a title bar color to each of your VS Code windows. No configuration. No settings files. Just click the Chroma icon in your status bar, pick a color, and you're done.

## Features

- Native color picker (macOS, Windows, Linux)
- Per-workspace — each project keeps its own color
- Status bar icon updates to match your chosen color
- Reset to default anytime

## Install

### Option 1 — VS Code Marketplace (free, recommended)
Search **"Chroma"** in the Extensions panel (`Cmd+Shift+X`), or go to the [Marketplace page](https://marketplace.visualstudio.com/items?itemName=ashsingh-ai.chroma) and click **Install**.

### Option 2 — VSIX manual install
1. Download the `.vsix` file from [Gumroad](https://wolfxweb.gumroad.com/l/chroma)
2. Open VS Code
3. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
4. Type **Install from VSIX** → select it
5. Choose the downloaded file → Open
6. Reload VS Code when prompted

## Usage

1. Click the **🎨 Chroma** icon in the status bar (bottom right)
2. Pick a color from the native color picker
3. Title bar changes instantly — saved per workspace

To reset: `Cmd+Shift+P` → **Chroma: Reset to Default**

## Platforms

| Platform | Color Picker | Status |
|----------|-------------|--------|
| macOS | Native (osascript) | Supported |
| Windows | Native (PowerShell ColorDialog) | Experimental |
| Linux | Hex input box | Experimental |

## License

MIT
