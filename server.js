// server
var net = require('net');
var CONFIG = require('./config');

// Connection listener
var server = net.createServer(function (socket) {
  // same as on 'connection'
  var socketAddress = socket.address().address;
  var socketPort = socket.address().port;

  socket.on('data', function(data) {
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





