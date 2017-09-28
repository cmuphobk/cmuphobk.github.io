// берём Express
var express = require('express');
var path = require('path')
// создаём Express-приложение
var app = express();
var fs = require('fs');


app.use(express.static(path.join(__dirname, '/')));
// создаём маршрут для главной страницы
// http://localhost:8085/

app.get('/', function(req, res) {
  res.sendfile('index.html');
});


// запускаем сервер на порту 8083
app.listen(8085);
// отправляем сообщение
console.log('Сервер стартовал!');