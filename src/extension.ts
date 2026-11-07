import * as vscode from 'vscode';
import { execFile } from 'child_process';

const PRESETS: { label: string; hex: string }[] = [
  { label: '🩷 Baby Pink',      hex: '#FFB7C5' },
  { label: '⚡ Electric Blue',  hex: '#0099FF' },
  { label: '🌊 Ocean Teal',     hex: '#008B8B' },
  { label: '🌿 Forest Green',   hex: '#228B22' },
  { label: '🌅 Sunset Orange',  hex: '#FF6B35' },
  { label: '🍇 Deep Purple',    hex: '#6B2D8B' },
  { label: '🌑 Midnight Black', hex: '#1A1A2E' },
  { label: '🤍 Soft White',     hex: '#F8F8F8' },
  { label: '✏️  Custom hex...',  hex: '' },
];

function lighten(hex: string, amount = 0.15): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 0xff) + 255 * amount));
  const g = Math.min(255, Math.round(((n >> 8)  & 0xff) + 255 * amount));
  const b = Math.min(255, Math.round((n          & 0xff) + 255 * amount));
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

function isDark(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8)  & 0xff;
  const b =  n        & 0xff;
  return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

async function applyColor(_ctx: vscode.ExtensionContext, hex: string): Promise<void> {
  const fg       = isDark(hex) ? '#FFFFFF' : '#1A1A1A';
  const inactive = lighten(hex, isDark(hex) ? 0.12 : -0.08);
  const inactiveFg = isDark(hex) ? '#CCCCCC' : '#666666';

  const config = vscode.workspace.getConfiguration('workbench');
  const existing = config.get<Record<string, string>>('colorCustomizations', {});

  await config.update('colorCustomizations', {
    ...existing,
    'titleBar.activeBackground':   hex,
    'titleBar.activeForeground':   fg,
    'titleBar.inactiveBackground': inactive,
    'titleBar.inactiveForeground': inactiveFg,
  }, vscode.ConfigurationTarget.Workspace);

}

function pickColorMacOS(currentHex: string): Promise<string | null> {
  // Convert hex to AppleScript 0-65535 RGB values
  const n = parseInt(currentHex.slice(1), 16);
  const r = Math.round(((n >> 16) & 0xff) / 255 * 65535);
  const g = Math.round(((n >> 8)  & 0xff) / 255 * 65535);
  const b = Math.round((n          & 0xff) / 255 * 65535);
  const script = `choose color default color {${r}, ${g}, ${b}}`;
  return new Promise(resolve => {
    execFile('osascript', ['-e', script], (err, stdout) => {
      if (err || !stdout.trim()) { resolve(null); return; }
      const parts = stdout.trim().split(/,\s*/);
      if (parts.length !== 3) { resolve(null); return; }
      const toHex = (v: number) => Math.round(v / 65535 * 255).toString(16).padStart(2, '0');
      resolve('#' + parts.map(p => toHex(parseInt(p))).join(''));
    });
  });
}

function pickColorWindows(currentHex: string): Promise<string | null> {
  const n = parseInt(currentHex.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8)  & 0xff;
  const b =  n        & 0xff;
  const script = [
    'Add-Type -AssemblyName System.Windows.Forms',
    `$c = New-Object System.Windows.Forms.ColorDialog`,
    `$c.Color = [System.Drawing.Color]::FromArgb(${r},${g},${b})`,
    `$c.FullOpen = $true`,
    `if ($c.ShowDialog() -eq 'OK') { "$($c.Color.R) $($c.Color.G) $($c.Color.B)" }`,
  ].join(';');
  return new Promise(resolve => {
    execFile('powershell', ['-NoProfile', '-Command', script], (err, stdout) => {
      if (err || !stdout.trim()) { resolve(null); return; }
      const parts = stdout.trim().split(/\s+/);
      if (parts.length !== 3) { resolve(null); return; }
      const toHex = (v: number) => v.toString(16).padStart(2, '0');
      resolve('#' + parts.map(p => toHex(parseInt(p))).join(''));
    });
  });
}

function getActiveColor(): string {
  const config = vscode.workspace.getConfiguration('workbench');
  const customs = config.get<Record<string, string>>('colorCustomizations', {});
  return customs['titleBar.activeBackground'] || '';
}

export function activate(ctx: vscode.ExtensionContext): void {
  const btn = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

  function refreshBtn() {
    const color = getActiveColor();
    btn.text    = '$(symbol-color) Chroma';
    btn.color   = color || undefined;
    btn.tooltip = color ? `${color.toUpperCase()} — click to change` : 'Chroma — set title bar color';
  }

  refreshBtn();
  btn.command = 'titlebarColor.pick';
  btn.show();
  ctx.subscriptions.push(btn);

  // Pick color command
  ctx.subscriptions.push(vscode.commands.registerCommand('titlebarColor.pick', async () => {
    const currentColor = getActiveColor() || '#1A1A2E';

    if (process.platform === 'darwin') {
      const hex = await pickColorMacOS(currentColor);
      if (hex) { await applyColor(ctx, hex); refreshBtn(); }
    } else if (process.platform === 'win32') {
      const hex = await pickColorWindows(currentColor);
      if (hex) { await applyColor(ctx, hex); refreshBtn(); }
    } else {
      const input = await vscode.window.showInputBox({
        prompt: 'Enter a hex color',
        value: currentColor,
        placeHolder: '#FF5733',
        validateInput: v => isValidHex(v) ? null : 'Must be a valid hex like #FF5733',
      });
      if (input) { await applyColor(ctx, input); refreshBtn(); }
    }
  }));

  // Reset command
  ctx.subscriptions.push(vscode.commands.registerCommand('titlebarColor.reset', async () => {
    const config = vscode.workspace.getConfiguration('workbench');
    const existing = config.get<Record<string, string>>('colorCustomizations', {});
    const cleaned = { ...existing };
    delete cleaned['titleBar.activeBackground'];
    delete cleaned['titleBar.activeForeground'];
    delete cleaned['titleBar.inactiveBackground'];
    delete cleaned['titleBar.inactiveForeground'];
    await config.update('colorCustomizations', cleaned, vscode.ConfigurationTarget.Workspace);
    refreshBtn();
    vscode.window.showInformationMessage('Title bar color reset to default.');
  }));

}

export function deactivate(): void {}
