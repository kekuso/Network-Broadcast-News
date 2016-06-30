// client
var net = require('net');
var Stream = require("stream");
var util = require('util');

var CONFIG = require('./config');

var socket = new net.Socket();
var input = process.stdin;

socket.connect({ port: CONFIG.PORT }, function () {
  var serverAddress = socket.remoteAddress;
  var serverPort = socket.remotePort;
  console.log('CONNECTED TO: ' + serverAddress + ":" + serverPort);
});

input.on('data', function (data) {
  socket.write(data);
});

socket.on('data', function(data) {
  console.log(data.toString());
});

socket.on('end', function () {
  console.log('disconnected from server.');
});

socket.on('error', function (err) {
  throw err;
});
