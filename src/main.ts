import { app, BrowserWindow } from 'electron';
import path from 'node:path';

function isSafeDevServerUrl(raw: string | undefined): raw is string {
  if (!raw) {
    return false;
  }

  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }
    if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1' && url.hostname !== '::1') {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

void app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1200, height: 800 });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (!app.isPackaged && isSafeDevServerUrl(devServerUrl)) {
    void win.loadURL(devServerUrl);
  } else {
    void win.loadFile(path.join(import.meta.dirname, 'renderer', 'index.html'));
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
