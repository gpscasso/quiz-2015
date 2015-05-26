var path = require('path');
var pg = require('pg');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = 	  (url[2]||null);
var pwd = 	  (url[3]||null);
var protocol =(url[1]||null);
var dialect = (url[1]||null);
var port = 	  (url[5]||null);
var host =    (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	 { dialect: protocol,
	 protocol: protocol,
	 port: port,
	 host: host,
	 storage: storage, // solo SQLite (.env)
	 omitNull: true // solo Postgres
	 }
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

//Importar definicion de la tabla User
var user_path = path.join(__dirname,'user');
var User = sequelize.import(user_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Los quizes pertenencen a un usuario registrado
Quiz.belongsTo(User);
User.hasMany(Quiz);

exports.Quiz = Quiz; // exportar tabla Quiz
exports.Comment = Comment;
exports.User = User;




// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync({force: true}).then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  User.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      User.bulkCreate( 
        [ {username: 'admin',    password: '1234', isAdmin: true},
          {username: 'guille',   password: 'gpscasso'} // el valor por defecto de isAdmin es 'false'
        ]
      ).then(function(){
        console.log('Base de datos (tabla user) inicializada');
        Quiz.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Quiz.bulkCreate( 
              [ {pregunta: 'Capital de Italia',   respuesta: 'Roma', 	  UserId: 2, image:'italia.png'}, // estos quizes pertenecen al usuario pepe (2)
                {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', 	  UserId: 2, image:'portugal.png'},
                {pregunta: 'Capital de España',	  respuesta: 'Madrid', 	  UserId: 2, image:'http://4.bp.blogspot.com/-DPp8wS9VFZY/U6i3kwVD3VI/AAAAAAAAFzc/QYKJM-qRTTg/s1600/Bandera%2Bde%2BItalia.jpg'},
 				{pregunta: 'Capital de Suecia',   respuesta: 'Estocolmo', UserId: 2, image:'sweeden.jpg'}
              ]
            ).then(function(){console.log('Base de datos (tabla quiz) inicializada')});
          };
        });
      });
    };
  });
});