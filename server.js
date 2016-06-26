// server
var net = require('net');
var CONFIG = require('./config');

var server = net.createServer(function (socket) {
  // Connection listener
  // same as on 'connection'
  console.log("someone connected!");

  socket.on('data', function(data) {
    console.log('received data from client: ' + data);
  });
  socket.on('end', function () {
    console.log('client disconnected.');
  });
  socket.write('hello!');
  socket.pipe(socket);
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Listening on port ' + CONFIG.PORT);
});

server.on('error', function (err) {
  console.log(err);
});





