const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Common setup
const app = express();
const cors = require('cors');
app.use(cors());

// ATIS Data and MDI/RCR Data
let atisData = {}; // ATIS specific data
let mdiData = {}; // MDI/RCR specific data
// ATIS Server setup
const atisServer = http.createServer(app);
const atisIo = socketIo(atisServer, { cors: { origin: "*" } });

app.get('/', (req, res) => {
  res.send("Server is running.");
});

atisIo.on('connection', (socket) => {
    console.log('New ATIS client connected');
    socket.emit('updateAtisData', atisData);

    socket.on('sendDataFromDisplay', (data) => {
        atisData = data;
        atisIo.emit('updateAtisData', atisData);
    });

    //test atisData
    app.get('/atisData', (req, res) => {
      res.send(atisData);
    });

    socket.on('disconnect', () => console.log('ATIS client disconnected'));
});

// RCR/MDI Server setup
const mdiServer = http.createServer(app);
const mdiIo = socketIo(mdiServer, { cors: { origin: "*" } });

mdiIo.on('connection', (socket) => {
    console.log('New MDI/RCR client connected');
    socket.emit('updateMdiData', mdiData);
    socket.emit('updateAtisData', atisData);

    socket.on('sendMdiFromSetting', (data) => {
        mdiData = data;
        mdiIo.emit('updateMdiData', mdiData);
    });
    socket.on('sendDataFromDisplay', (data) => {
        atisData = data;
        mdiIo.emit('updateAtisData', atisData);
    });
      //test mdiData
    app.get('/mdiData', (req, res) => {
        res.send(mdiData);
    });

    socket.on('disconnect', () => console.log('MDI/RCR client disconnected'));
});


// Listen on different ports
const ATIS_ARRIVAL_PORT = 1150;
const ATIS_DEPARTURE_PORT = 1250;
const MDI_RCR_PORT = 1350;

atisServer.listen(ATIS_ARRIVAL_PORT, () => console.log(`ATIS server running on port ${ATIS_ARRIVAL_PORT}`));
mdiServer.listen(MDI_RCR_PORT, () => console.log(`MDI/RCR server running on port ${MDI_RCR_PORT}`));