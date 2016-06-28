// server
var net = require('net');
var CONFIG = require('./config');

var serverAddress;
var server = net.createServer(function (socket) {
  // Connection listener
  // same as on 'connection'
  var socketAddress;
  var socketPort;
  console.log("someone connected!");

  socket.on('data', function(data) {
    socketAddress = socket.address().address;
    socketPort = socket.address().port;
    console.log('SERVER BCAST FROM ' + socketAddress + ":" + socketPort + " : " + data);
  });
  socket.on('end', function () {
    console.log('CLOSED: ' + socketAddress + ":" + socketPort);
  });
  socket.pipe(socket);
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Server listening on 127.0.0.1:' + CONFIG.PORT);
});

server.on('error', function (err) {
  console.log(err);
});





