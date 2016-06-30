// server
var net = require('net');
var CONFIG = require('./config');
var clients = [];
var count = 0;
var userArray = [];
var input = process.stdin;

// Connection listener
var server = net.createServer(function (socket) {
  clients.push(socket);
  console.log("Enter a username: ");
  var socketAddress = socket.address().address;
  var socketPort = socket.remotePort;
  var broadcast;
  console.log("CONNECTED: " + socketAddress + ":" + socketPort);

  socket.on('data', function(data) {
    // populate array of usernames
    if(userArray.length < clients.length || userArray.length === 0) {
      userArray[count] = data;
      count++;
      console.log("Added username: " + data + " to array index " + count);
    }

    // display client's message on server
    var index = clients.indexOf(socket);
    console.log(('SERVER BCAST FROM ' + socketAddress + ":" + socket.remotePort + " " + userArray[index] + ": " + data).replace(/(\r\n|\n|\r)/gm,""));

    // determine which client sent the message
    for(var i = 0; i < clients.length; i++) {
      if(i === clients.indexOf(socket)) {
        socketAddress = clients[i].remoteAddress;
        socketPort = clients[i].remotePort;
        broadcast = userArray[i] + ": " + socketAddress + ":" + socketPort + " : " + data;
      }
    }

    // display client's message to all clients
    for(var j = 0; j < clients.length; j++) {
      clients[j].write(broadcast);
    }
  });

  // broadcast server's message to all clients
  input.on('data', function (data) {
    socket.write("[ADMIN]: " + data);
  });

  // decrement arrays when a client disconnects
  socket.on('end', function (socket) {
    console.log('CLOSED: ' + socketAddress + ":" + socketPort);
    var index = clients.indexOf(socket);
    clients.splice(clients.indexOf(socket), 1);
    userArray.splice(index, 1);
    count--;
  });
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Server listening on 127.0.0.1:' + CONFIG.PORT);
});

server.on('error', function (err) {
  throw err;
});

