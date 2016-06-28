// server
var net = require('net');
var CONFIG = require('./config');
var clients = [];
// Connection listener
var server = net.createServer(function (socket) {
  clients.push(socket);
  // same as on 'connection'
  var socketAddress = socket.address().address;
  var socketPort = socket.address().port;
  console.log("CONNECTED: " + socketAddress + ":" + socketPort);

  socket.on('data', function(data) {
    console.log('SERVER BCAST FROM ' + socketAddress + ":" + socketPort + " : " + data);

    for(var i = 0; i < clients.length; i++) {
      socketAddress = clients[i].address().address;
      socketPort = clients[i].address().port;
      clients[i].write(socketAddress + ":" + socketPort + " : " + data);
    }

  });

  socket.on('end', function () {
    console.log('CLOSED: ' + socketAddress + ":" + socketPort);
  });
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Server listening on 127.0.0.1:' + CONFIG.PORT);
});

server.on('error', function (err) {
  throw err;
});





