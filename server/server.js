const socketIO = require ('socket.io')
const http = require('http')
const path = require ('path')
const express = require('express')
const publicPath = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;
var app = express();
const {generateMessage,generateLocationMessage} = require('C:\\Nitin\\Study\\NodeJs\\node-chat-app\\server\\utils\\message.js');
const {isRealString} = require ('C:\\Nitin\\Study\\NodeJs\\node-chat-app\\server\\utils\\validation.js');
const {Persons} =  require('C:\\Nitin\\Study\\NodeJs\\node-chat-app\\server\\utils\\users.js');

var server = http.createServer(app);
var io = socketIO(server);
var persons = new Persons ();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log("New user is connected");

  socket.on ('join',(receivedParams, callback) => {
    console.log ('receivedParams' , receivedParams)

    if (!isRealString(receivedParams.room) || !isRealString(receivedParams.name)) {
      callback ('Name and Room required')
    }

    socket.join(receivedParams.room);
    persons.removeUser (socket.id);
    persons.addUser (socket.id, receivedParams.name, receivedParams.room);

    io.to(receivedParams.room).emit ('updateUserList',persons.getUserList(receivedParams.room));

    socket.emit('newMessage', generateMessage ("Admin","Most Welcome to Chat Application"));

    socket.broadcast.to(receivedParams.room).emit('newMessage',generateMessage("Admin",`${receivedParams.name} has joined`));

    callback ();
    
  })

  socket.on('createMessage',(receivedClientMessage,callback)=>{
    console.log('server.js : createMessage',receivedClientMessage);
    var user = persons.getUser(socket.id);
    if (user && isRealString(receivedClientMessage.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name,receivedClientMessage.text));  
    }
    
    callback('Server.js: this callback is from server');
  });

  socket.on('createLocationMessage', (locationData) =>{
    var user = persons.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,locationData.latitude,locationData.longitude) );  
    }
    
  });

  socket.on('disconnect',()=>{
    var user = persons.removeUser (socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList',persons.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));       
    }
    console.log("Server.js: User was disconnected");
  });

});

server.listen(3000,()=>{
  console.log(`Server.js: server is up and running ${port}`);
});
