// client
var net = require('net');
var Stream = require("stream");
var util = require('util');

var CONFIG = require('./config');

var socket = new net.Socket();
var input = process.stdin;

input.on('data', function (data) {
  socket.write(data);
});

socket.connect({ port: CONFIG.PORT }, function () {
  //process.stdin.pipe()
  var output = process.stdout;
  console.log('connected to server');
  // socket.write(input);
  // socket.write('testing...');
});

socket.on('data', function(data) {
  console.log(data.toString());

  // socket.end();
});

socket.on('end', function () {
  console.log('disconnected from server.');
});