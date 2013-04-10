var supported = ("WebSocket" in window);
if (supported) alert ("WebSockets are supported");

var socket = new WebSocket("ws://example.com");

// The connection has connected
socket.onopen = function() { /* ... */ }

// The connection has some new data
socket.onmessage = function(data) { /* ... */ }

// The connection has closed
socket.onclose = function() { /* ... */ }


socket.onmessage = function(msg){
  console.log("New data - ", msg);
};

socket.onopen = function(){
  socket.send("Why, hello there");
};


var rpc = {
  test: function(arg1, arg2) { /* ... */ }
};

socket.onmessage = function(data){
  // Parse JSON
  var msg = JSON.parse(data);

  // Invoke RPC function
  rpc[msg.method].apply(rpc, msg.args);
};


