
var models = require('../models/models.js');

exports.add = function(req, res, next) {
	req.user.addFavourites(req.quiz.id).then(function(){
		res.redirect('back');
	}).catch(function(error){ next(error);})
};

exports.show = function(req, res, next) {
	req.user.getFavourites().then(function(favourites){
 			res.render('quizes/favourites.ejs',{quizes:favourites, errors:[]});
 	}).catch(function(error){ next(error);})

};

exports.destroy = function(req, res, next) {
	req.user.removeFavourites(req.quiz).then(function(){
 			res.redirect('back');
 	}).catch(function(error){next(error);})

};