const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 420,
    height: 850,
    minWidth: 350,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    alwaysOnTop: true,
    frame: true,
    transparent: false,
    backgroundColor: '#1e1e1e',
    resizable: true,
    title: 'Lyricus'
  });

  // Load from Express server instead of file
  mainWindow.loadURL('http://127.0.0.1:3000');

  // Open DevTools for debugging
  // mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
