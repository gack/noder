var config = { 
    main_host: '0.0.0.0',
    main_port: process.env.C9_PORT || 8338,
    mongo_host : "flame.mongohq.com",
    mongo_port : 27063
};

var http = require('http'),
    fs = require('fs'),
    io = require('socket.io'),
    stat = require('node-static'),
    mongo = require('mongoskin');

db = mongo.db('admin:pass@localhost/mydb?auto_reconnnect');
db.addListener("error", function(error) {
  console.log("Error connecting to mongo -- perhaps it isn't running?");
});
db.open(function(){
    console.log('db.open');
});

db.createCollection('testCollection', function(err, collection) {
    console.log('db.collection');
    doc = {
        "name":"mongoDB",
        "type":"database",
        "count":1,
        "info": {
            x:203,
            y:102
        }
    };
    
    collection.insert(doc,function(){
        console.log('collection insert');
    });

});
        

var file = new(stat.Server)('./public');
var server = http.createServer(function(req,res){
    req.addListener('end', function() {
        file.serve(req, res);
    });
});

server.listen(config.main_port, config.main_host);
  
var socket = io.listen(server);

// Add a connect listener
socket.on('connection', function(client){ 
      
  // Success!  Now listen to messages to be received
  client.on('message',function(event){
    console.log('Received message from client!',event);
  });
  client.on('disconnect',function(){
    console.log('Server has disconnected');
  });
  client.on('subscribe', function(channel) {
   // do some checks here if u like
   console.log('subscribed to channel: ' + channel);
   client.subscribe(channel);
  });
  client.on('unsubscribe', function(channel) {
       client.unsubscribe(channel);
  });
  client.on('publish', function(channel, message) {
       client.publish(channel, message);
  });

});