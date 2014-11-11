exports.socket = function(client){
  client.on('send-server', function (data) {
    
    var tipo = data.tipo;
    var controller = require('./'+tipo);

    if(typeof controller.create == 'function'){
    	client.emit(data.tipo, data);
    	client.broadcast.emit(data.tipo, data);
    	controller.create(data);
    }

  }); 
}
