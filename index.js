const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);

// Allow all origins for Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/", (req, res) => {
     console.log("Form Submitted successfully..");
     console.log(req.body);
     res.send("Form submitted successfully");
 });
 


const users = {};



io.on("connection", (socket) => {
     socket.on("new-user-joined", (name) => {
          console.log("User is: ", name);
          users[socket.id] = name;
          socket.broadcast.emit("user-joined", name);
     });

     socket.on("send", (message) => {
          socket.broadcast.emit("receive", { message: message, name: users[socket.id] });
     });

     socket.on('disconnect', (message) => {
          socket.broadcast.emit('left', users[socket.id]);
          delete users[socket.id];
     });
});



server.listen(8000, () => {
     console.log('Server is running on http://127.0.0.1:8000');
});




