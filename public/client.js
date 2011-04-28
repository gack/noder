HOST = location.hostname;
PORT = location.port;
  
  function message(obj){
    var el = dojo.create('p');
    if ('announcement' in obj) el.innerHTML = '<em>' + esc(obj.announcement) + '</em>';
    else if ('message' in obj) el.innerHTML = '<b>' + esc(obj.message[0]) + ':</b> ' + esc(obj.message[1]);
    
    if( obj.message && window.console && console.log ) console.log(obj.message[0], obj.message[1]);
    dojo.byId('chat').appendChild(el);
    dojo.byId('chat').scrollTop = 1000000;
  }
  
  function send(){
    var val = dojo.byId('text').value;
    socket.send(val);
    message({ message: ['you', val] });
    dojo.byId('text').value = '';
  }
  
  function esc(msg){
    return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
        
  
  function connectSoc() {
        var chanIpt = dojo.query('#inputChannel').attr('value');
        
        dojo.query('#pickChannel').style({display:"none"});
        dojo.query('#chatInput').style({display:""});
        socket.send(message({message: ['channel', 'connected'], type: 'subscribe', channel: chanIpt[0]}));
       
  };
  
  var socket = new io.Socket(null, {port: PORT , rememberTransport: false});
 
  socket.connect();
  socket.on('message', function(obj){
    if ('buffer' in obj){
      dojo.byId('form').style.display='block';
      dojo.byId('chat').innerHTML = '';
      
      for (var i in obj.buffer) message(obj.buffer[i]);
    } else message(obj);
  });
  socket.on('subscribe', function(channel){ message({message: ['System', 'Subscribe' + channel]})});
  socket.on('connect', function(){ message({ message: ['System', 'Connected']})});
  socket.on('disconnect', function(){ message({ message: ['System', 'Disconnected']})});
  socket.on('reconnect', function(){ message({ message: ['System', 'Reconnected to server']})});
  socket.on('reconnecting', function( nextRetry ){ message({ message: ['System', 'Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms']})});
  socket.on('reconnect_failed', function(){ message({ message: ['System', 'Reconnected to server FAILED.']})});