var async = require('async');
var models = require('../models');


module.exports = function(io) {
	var sockets = io.sockets;

	/*Cadastra Tarefa*/
	async.waterfall([
		function(callback){
			sockets.on('connection', function (client) {
				callback(null, client);
			});
		},
		function(client, callback){
			client.on('send-server', function (dados) {
				callback(null, dados, client);
			});
		},
		function(dados, client, callback){
		    models.Task.create({
		      title: dados.nome,
		      UserId: dados.usuario
		    }).success(function(tarefa){
		      console.log('entrou no banco');
		      callback(null, dados, client, tarefa);
		    });
		},
		function(dados, client, tarefa, callback){
			client.emit('tasks', tarefa);
			client.broadcast.emit('tasks', tarefa);
			callback(null, tarefa);
		}
		],function (err, sucess) {
			if(err){
				console.log(err);
			}
		});
}

