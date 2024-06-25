const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let inputPath = '';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('open-file-dialog', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  inputPath = result.filePaths[0];
  return result.filePaths;
});

ipcMain.on('open-file', (event) => {
  if (inputPath === '') {
    event.reply('response-data', { message: 'Tried to open empty file path' });
  } else {
    try {
      fs.readFile(inputPath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading the file: ${err}`);
          return;
        }
        event.reply('response-data', { message: `${data}`});
      });
    } catch(error) {
      event.reply('response-data', { message: `failed opening '${inputPath}'`});
    }
    event.reply('response-data', { message: `'${inputPath}' is the opened file path`});
  }
})
