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
app.get('/gazprom', function(req, res) {
  res.sendfile('gazprom.html');
});
app.get('/graphicDom', function(req, res) {
  res.sendfile('graphicDom.html');
});
app.get('/map', function(req, res) {
  res.sendfile('map.html');
});

// запускаем сервер на порту 8083
app.listen(8083);
// отправляем сообщение
console.log('Сервер стартовал!');