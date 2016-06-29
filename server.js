// server
var net = require('net');
var CONFIG = require('./config');
var clients = [];
var count = 0;
var userArray = [];
// Connection listener
var server = net.createServer(function (socket) {
  clients.push(socket);
  console.log("Enter a username: ");
  var socketAddress = socket.address().address;
  var socketPort = socket.remotePort;
  var broadcast;
  console.log("CONNECTED: " + socketAddress + ":" + socketPort);

  socket.on('data', function(data) {
    if(userArray.length < clients.length || userArray.length === 0) {
      userArray[count] = data;
      count++;
      console.log("Added username: " + data + " to array index " + count);
    }
    var index = clients.indexOf(socket);
    console.log(('SERVER BCAST FROM ' + socketAddress + ":" + socket.remotePort + " " + userArray[index] + ": " + data).replace(/(\r\n|\n|\r)/gm,""));

    for(var i = 0; i < clients.length; i++) {
      if(i === clients.indexOf(socket)) {
        socketAddress = clients[i].remoteAddress;
        socketPort = clients[i].remotePort;
        broadcast = userArray[i] + ": " + socketAddress + ":" + socketPort + " : " + data;
      }
    }

    for(var j = 0; j < clients.length; j++) {
      clients[j].write(broadcast);
    }
  });

  socket.on('end', function (socket) {
    console.log('CLOSED: ' + socketAddress + ":" + socketPort);
    var index = clients.indexOf(socket);
    clients.splice(clients.indexOf(socket), 1);
    userArray.splice(index, 1);
    count--;
  });

  // function addUser (name) {
  //   console.log("Enter a username: ");
  // }
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Server listening on 127.0.0.1:' + CONFIG.PORT);
});

server.on('error', function (err) {
  throw err;
});

