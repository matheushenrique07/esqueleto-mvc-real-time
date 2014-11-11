var models  = require('../models');

exports.home = function(req, res) {
  models.User.findAll({
    include: [models.Task]
  }).success(function(users) {
  	var dados = { title: 'Express', users: users};
    res.render('index', dados);
  });
}

exports.users = function(req, res) {
  models.User.create({
    username: req.param('username')
  }).success(function() {
    res.redirect('/');
  });
}

/*exports.create = function(req,res){
  models.User.find({
    where: { id: req.param('user_id') }
  }).success(function(user) {
    models.Task.create({
      title: req.param('title')
    }).success(function(title) {
      title.setUser(user).success(function() {
        res.redirect('/');
      });
    });
  });
}*/

exports.create = function(data){
    models.Task.create({
      title: data.nome,
      UserId: data.usuario
    }).success(function(){
      console.log('entrou no banco');
    });
}