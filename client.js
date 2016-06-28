// client
var net = require('net');
var Stream = require("stream");
var util = require('util');

var CONFIG = require('./config');

var socket = new net.Socket();
var input = process.stdin;

socket.connect({ port: CONFIG.PORT }, function () {
  var output = process.stdout;
  console.log('connected to server');
});

input.on('data', function (data) {
  socket.write(data);
});

socket.on('data', function(data) {
  console.log(data.toString());

  // socket.end();
});

socket.on('end', function () {
  console.log('disconnected from server.');
});