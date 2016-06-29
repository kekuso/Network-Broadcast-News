// server
var net = require('net');
var CONFIG = require('./config');
var clients = [];
// Connection listener
var server = net.createServer(function (socket) {
  clients.push(socket);
  // console.log("Pushing socket with port : " + socket.remotePort + " onto array.");
  var socketAddress = socket.address().address;
  var socketPort = socket.remotePort;
  console.log("CONNECTED: " + socketAddress + ":" + socketPort);

  socket.on('data', function(data) {
    console.log('SERVER BCAST FROM ' + socketAddress + ":" + socket.remotePort + " : " + data);

    for(var i = 0; i < clients.length; i++) {
      socketAddress = clients[i].address().address;
      socketPort = clients[i].remotePort;
      clients[i].write(socketAddress + ":" + socketPort + " : " + data);
    }

  });

  socket.on('end', function (socket) {
    console.log('CLOSED: ' + socketAddress + ":" + socketPort);
    clients.splice(clients.indexOf(socket), 1);
  });
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Server listening on 127.0.0.1:' + CONFIG.PORT);
});

server.on('error', function (err) {
  throw err;
});





