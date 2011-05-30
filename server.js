var config = { 
    main_host: '0.0.0.0',
    main_port: process.env.C9_PORT || 8338,
    mongo_host : "flame.mongohq.com",
    mongo_port : 27063
};

var http = require('http'),
    fs = require('fs'),
    nowjs = require('now'),
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

var everyone = nowjs.initialize(server);


everyone.on('connect', function(){
  this.now.room = "room 1";
  nowjs.getGroup(this.now.room).addUser(this.user.clientId);
  console.log("Joined: " + this.now.name);
});


everyone.on('disconnect', function(){
  console.log("Left: " + this.now.name);
});

everyone.now.changeRoom = function(newRoom){
  nowjs.getGroup(this.now.room).removeUser(this.user.clientId);
  nowjs.getGroup(newRoom).addUser(this.user.clientId);
  this.now.room = newRoom;
  this.now.receiveMessage("SERVER", "You're now in " + this.now.room);
}

everyone.now.distributeMessage = function(message){
  nowjs.getGroup(this.now.room).now.receiveMessage(this.now.name, message);
};