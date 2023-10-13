'use strict';

import { app, protocol, BrowserWindow, ipcMain, Menu, dialog } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
const isDevelopment = process.env.NODE_ENV !== 'production';
const fs = require('fs');
const path = require('path');
// const debug = require('electron-debug');

// // Enable the inspection tool
// debug({ showDevTools: true });

let selectedFilePath;

// 1. Make the setFolderPath function asynchronous
async function setFolderPath(manual = false) {
  const window = BrowserWindow.getFocusedWindow();

  const result = await dialog.showOpenDialog(window, {
    properties: manual ? ['openFile'] : ['openDirectory']
  });

  if (!result.canceled) {
    if (manual) {
      selectedFilePath = result.filePaths[0];
      console.log('About to send selected path:', selectedFilePath);
      window.webContents.send('selected-file-path', selectedFilePath);
    } else {
      const folderPath = result.filePaths[0];
      const files = fs.readdirSync(folderPath);

      const sortedFiles = files
        .filter(file => /\.txt$/.test(file))
        .sort((a, b) => b.localeCompare(a));

      if (sortedFiles.length) {
        selectedFilePath = path.join(folderPath, sortedFiles[0]);
        window.webContents.send('selected-file-path', selectedFilePath);
      } else {
        console.log('No text files found in the selected directory.');
        selectedFilePath = undefined;
      }

       // 5. Watch the folder for changes using fs.watch
       fs.watch(folderPath, (eventType, filename) => {
        if (eventType === 'rename' && /\.txt$/.test(filename)) {
          console.log('File added or removed:', filename);
          const newFiles = fs.readdirSync(folderPath);
          const newSortedFiles = newFiles
            .filter(file => /\.txt$/.test(file))
            .sort((a, b) => b.localeCompare(a));
          if (newSortedFiles.length) {
            const latestFile = newSortedFiles[0];
            const newFilePath = path.join(folderPath, latestFile);
            if (newFilePath !== selectedFilePath) {
              console.log('New file selected:', latestFile);
              selectedFilePath = newFilePath;
              window.webContents.send('selected-file-path', selectedFilePath);
            }
          } else {
            console.log('No text files found in the selected directory.');
            selectedFilePath = undefined;
            window.webContents.send('selected-file-path', selectedFilePath);
          }
        }
      });
    }
  } else {
    console.log('No file selected.');
    selectedFilePath = undefined;
    window.webContents.send('selected-file-path', selectedFilePath);
  }
  console.log('selectedFilePath', selectedFilePath);
  window.webContents.send('selected-file-path', selectedFilePath);
}

// 2. Use async/await in your ipcMain handler
ipcMain.on('set-folder-path', async (event, manual) => {
  await setFolderPath(manual);
  event.reply('selected-file-path', selectedFilePath);
});

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true
      
    }
  });
  win.loadFile('index.html');
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Set Folder Path',
          click: () => setFolderPath(false)
        },
        {
          label: 'Select File Manually',
          click: () => setFolderPath(true)
        },
        {
          label: 'Clear Cache',
          click: async () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              const ses = focusedWindow.webContents.session;
              await ses.clearCache();
              console.log('Cache cleared!');
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

// ipcMain.on('set-folder-path', (event) => {
//   // Your logic to get the latest file's path
//   const filePath = 'D:\\ATIS-INFO\\20230928-000357Z-AtisMsg.txt';  // Example path
//   event.reply('selected-file-path', filePath);
// });

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
