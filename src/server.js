const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

//Common setuo for the server
const app = express();
const server = http.createServer(app);
//const allowedOrigins = ['192.168.1.100', '192.168.1.63', "app://."]; 
const io = socketIo(server, {
    cors: {
    //test environment
      origin: "*",
      credentials: true

    //production
    //   origin: (origin, callback) => {
    //     if (!origin || allowedOrigins.includes(origin)) {
    //         callback(null, true);
    //     } else {
    //         callback(new Error('Not allowed by CORS'));
    //     }
    // },
      
    }
  });

const cors = require('cors');

app.use(cors());

let atisData = {};  // Initialize with an empty object or a default value
let mdiData = {};  // Initialize with an empty object or a default value

app.get('/', (req, res) => {
  res.send("Server is running.");
});

io.on('connection', (socket) => {
   
    socket.emit('updateData', atisData); // send the data to the client that just connected
    socket.emit('updateMdiData', mdiData); // send the data to the client that just connected

    socket.on('sendDataFromDisplay', (data) => {
        atisData = data;
        socket.broadcast.emit('updateData', atisData);
    });

    socket.on('sendMdiFromSetting', (data) => {
      mdiData = data;
      socket.broadcast.emit('updateMdiData', mdiData);
    });

    //test atisData
    app.get('/atisData', (req, res) => {
        res.send(atisData);
    });

    //test mdiData
    app.get('/mdiData', (req, res) => {
        res.send(mdiData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
