const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');


contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    on: (channel, callback) => {
        ipcRenderer.on(channel, (event, ...args) => callback(...args));
    },
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    },
    invoke: (channel, ...args) => {
        return ipcRenderer.invoke(channel, ...args);
    },
    getAppPath: () => {
        ipcRenderer.invoke('get-app-path')
    },
    loadAudio: (fileName) => ipcRenderer.invoke('load-audio', fileName)
});
