var models  = require('../models');

exports.create = function(data){
    models.Task.create({
      title: data.nome,
      UserId: data.usuario
    }).success(function(){
      console.log('entrou no banco');
    });
}