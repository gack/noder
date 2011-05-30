HOST = location.hostname;
PORT = location.port;

$(document).ready(function(){
  now.name = prompt("What's your name?", "");  
  now.receiveMessage = function(name, message){
    $("#messages").append("<br>" + name + ": " + message);
  }
  
  $("#send-button").click(function(){
    now.distributeMessage($("#text-input").val());
    $("#text-input").val("");
  });
  
  $(".change").click(function(){
    now.changeRoom($(this).text());
  });
  
});  socket.on('reconnect_failed', function(){ message({ message: ['System', 'Reconnected to server FAILED.']})});