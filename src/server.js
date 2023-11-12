const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      //test environment
      origin: ["http://localhost:8080", "app://."],
      //production environment
      //origin: ["http://localhost:3000", "app://."],
      credentials: true
    }
  });

const cors = require('cors');

app.use(cors());

let atisData = {};  // Initialize with an empty object or a default value

// app.get("/socket.io/socket.io.js", (req, res) => {
//     res.sendFile(require.resolve("socket.io/client-dist/socket.io.js"));
//   });

  app.get('/', (req, res) => {
    res.send("Server is running. Socket.io is listening on port 3000");
});

io.on('connection', (socket) => {
    console.log('New client connected'); 
    console.log(socket.id);
    // Listen for data from the display component
    
    socket.on('sendDataFromDisplay', (data) => {
        console.log('Received data from display component:', data);

        atisData = data;
        
        // If you want to broadcast this data to other clients:
        console.log('Broadcast ATIS data to client:', atisData);
        socket.broadcast.emit('updateData', atisData);
    });
    console.log('Sending ATIS data to client:', atisData);

    app.get('/atisData', (req, res) => {
        res.send(atisData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});



server.listen(3000, '0.0.0.0',() => {
    console.log('Server is running on port 3000');
});