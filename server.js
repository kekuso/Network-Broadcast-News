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
  socket.write("Enter a username: ");
  var socketAddress = socket.address().address;
  var socketPort = socket.remotePort;
  var broadcast;
  var duplicate = false;
  console.log("CONNECTED: " + socketAddress + ":" + socketPort);

  socket.on('data', function(data) {
    // populate array of usernames
    if(userArray.length < clients.length) {
      // check for admin imposter
      if(data.toString().toUpperCase().trim() === '[ADMIN]') {
        console.log("Imposter detected.");
        socket.write("[ADMIN] You are an imposter. ACTIVATING BAN HAMMER");
        socket.destroy();
        // userArray[count] = 'IMPOSTER' + count;
        // count++;
      }
      else {
        for(var k = 0; k < userArray.length; k++) {
          //console.log("Comparing " + data.toString().replace(/(\r\n|\n|\r)/gm,"") + " and " + userArray[k].replace(/(\r\n|\n|\r)/gm,""));
          // check for duplicate username
          if(data.toString() === userArray[k]) {
            socket.write("That username is already taken. You will be named John Doe X.");
            userArray[count] = 'John Doe ' + count;
            count++;
            duplicate = true;
            break;
          }
          else {
            duplicate = false;
          }
        }
        if(!duplicate) {
          userArray[count] = data.toString();
          count++;
          socket.write("Welcome " + data);
          duplicate = false;
        }
      }
    }

    else {
      // display client's message on server
      var index = clients.indexOf(socket);
      console.log(('SERVER BCAST FROM ' + socketAddress + ":" + socket.remotePort + " " + userArray[index] + ": " + data).replace(/(\r\n|\n|\r)/gm,""));

      // determine which client sent the message
      for(var i = 0; i < clients.length; i++) {
        if(i === clients.indexOf(socket)) {
          socketAddress = clients[i].remoteAddress;
          socketPort = clients[i].remotePort;
          broadcast = (socketAddress + ":" + socketPort + " " + userArray[i] + ": " + data).replace(/(\r\n|\n|\r)/gm,"");
        }
      }

      // display client's message to all clients
      for(var j = 0; j < clients.length; j++) {
        clients[j].write(broadcast);
      }
    }
  });

  // decrement arrays when a client disconnects
  socket.on('close', function () {
    console.log('CLOSED: ' + socketAddress + ":" + socketPort);
    var index = clients.indexOf(socket);
    // console.log("index: " + index);
    clients.splice(index, 1);
    // console.log("clients.length: " + clients.length);
    if(userArray.length > 0) {
      userArray.splice(index, 1);
    }
    // console.log("userArray.length: " + userArray.length);
    count--;
    //console.log("Count = " + count);
  });
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Server listening on 127.0.0.1:' + CONFIG.PORT);
});

// broadcast server's message to all clients
input.on('data', function (data) {
  //console.log("clients.length: " + clients.length);
  for(var j = 0; j < clients.length; j++) {
    // check if server wants to kick a client
    // console.log("Data: " + data);
    // console.log("userArray[j] = " + userArray[j]);
    if(data.toString() === '\\kick ' + userArray[j].toString() ||
      data.toString().replace(/(\r\n|\n|\r)/gm,"") === '\\kick ' + clients[j].remotePort.toString()) {
      clients[j].write("You're getting kicked.");
      clients[j].destroy();
    }
    else {
      clients[j].write('[ADMIN]: ' + data);
    }
  }
});

server.on('error', function (err) {
  throw err;
});