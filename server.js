// берём Express
var express = require('express');
var path = require('path')
// создаём Express-приложение
var app = express();


app.use(express.static(path.join(__dirname, '/')));
// создаём маршрут для главной страницы
// http://localhost:8081/
app.get('/', function(req, res) {
  res.sendfile('index.html');
});
app.get('/graphic', function(req, res) {
  res.sendfile('graphic.html');
});

// запускаем сервер на порту 8081
app.listen(8081);
// отправляем сообщение
console.log('Сервер стартовал!');