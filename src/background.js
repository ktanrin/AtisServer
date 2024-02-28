'use strict';

import { app, protocol, BrowserWindow, ipcMain, Menu, dialog, webContents } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';


const isDevelopment = process.env.NODE_ENV !== 'production';
const fs = require('fs');
const path = require('path');

//const express = require('express');
//const http = require('http');

//const expressApp = express();
//const server = http.createServer(expressApp);
const server = require('./server2.js'); 

const userDataPath = app.getPath('userData');
console.log('User data path:', userDataPath);
const settingsFilePath = path.join(userDataPath, 'user-settings.json');
console.log('Settings file path:', settingsFilePath);

// Path to the JSON file where MDI data will be stored
const mdiDataPath = path.join(app.getPath('userData'), 'mdiData.json');

let selectedFilePath;


function saveFolderPath(folderPath) {
  const settings = { folderPath };
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings));
}

function loadSavedFolderPath() {
  try {
    const data = fs.readFileSync(settingsFilePath, 'utf8');
    const settings = JSON.parse(data);
    return settings.folderPath;
  } catch (error) {
    return null;
  }
}

function selectLatestTextFile(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    const txtFiles = files.filter(file => /\.txt$/.test(file));
    if (txtFiles.length > 0) {
        const latestFile = txtFiles.reduce((a, b) => {
            const aStat = fs.statSync(path.join(folderPath, a));
            const bStat = fs.statSync(path.join(folderPath, b));
            return aStat.mtime > bStat.mtime ? a : b;
        });
        selectedFilePath = path.join(folderPath, latestFile);
        console.log('Latest file selected:', selectedFilePath);
        
        // Send the selected file path to the renderer process if needed
        const window = BrowserWindow.getAllWindows()[0];
        
        // Then send the message to the renderer process
    if (window) {
      window.webContents.send('selected-file-path', selectedFilePath);
    } else {
      console.error('No focused window to send the file path');
    }
    }
} catch (error) {
    console.error('Error selecting the latest file:', error);
}
}

function setupFolderWatcher(folderPath) {
  
  fs.watch(folderPath, (eventType, filename) => {
    console.log('setupwacth Event type:', eventType);
    if (eventType === 'rename' && /\.txt$/.test(filename)) {
      console.log('File added or removed:', filename);
      selectLatestTextFile(folderPath);
    }
  });
}

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
      saveFolderPath(folderPath); // Save the new path
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
  // window.webContents.send('selected-file-path', selectedFilePath);
}

// 2. Use async/await in your ipcMain handler
// ipcMain.on('set-folder-path', async (event, manual) => {
//   await setFolderPath(manual);
//   event.reply('selected-file-path', selectedFilePath);
// });

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

const enableDevToolsInProduction = true;

async function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 940,
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
        },
        {
          label: 'DevTools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.toggleDevTools();
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
  //  Stop the Express.js server
  //  server.close(() => {
  //   console.log('Express server stopped');
  // });
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('ready', async () => {
  const savedFolderPath = loadSavedFolderPath();
  createWindow();
  
  if (savedFolderPath && fs.existsSync(savedFolderPath)) {
    console.log('Saved folder path:', savedFolderPath);
    setupFolderWatcher(savedFolderPath);
     BrowserWindow.getAllWindows()[0].webContents.once('did-finish-load', () => {
      selectLatestTextFile(savedFolderPath);
    });

  
     //window.webContents.send('selected-file-path', saveFolderPath);
    console.log('savedFolderPath:', savedFolderPath);
  } else {
    setFolderPath(); // Prompt for path if none saved or invalid
  }
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  //createWindow();
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


ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Handler to load MDI data
ipcMain.handle('load-mdi-data', async (event) => {
  try {
    let data = [];
    if (fs.existsSync(mdiDataPath)) {
      const fileContent = fs.readFileSync(mdiDataPath, 'utf8');
      data = JSON.parse(fileContent);

      // If the data is not an array, convert it to an array
      if (!Array.isArray(data)) {
        console.warn('MDI data is not an array. Converting to array.');
        // Convert object to array or wrap the object in an array
        data = typeof data === 'object' && data !== null ? [data] : [];
      }
    }
    // If the file doesn't exist or the data is not an object, return an empty array
    console.log('MDI data loaded:', data);
    return data;
  } catch (error) {
    console.error('Failed to load MDI data:', error);
    // Return an empty array if there's an error
    return [];
  }
});

// Handler to save MDI data
ipcMain.handle('save-mdi-data', async (event, mdiData) => {
  try {
    fs.writeFileSync(mdiDataPath, JSON.stringify(mdiData, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Failed to save MDI data:', error);
    return { success: false, error: error.message };
  }
});
