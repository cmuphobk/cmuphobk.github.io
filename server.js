// берём Express
var express = require('express');
var path = require('path')
// создаём Express-приложение
var app = express();
var fs = require('fs');


app.use(express.static(path.join(__dirname, '/')));
// создаём маршрут для главной страницы
// http://localhost:8083/

app.get('/graphicDom', function(req, res) {
  res.sendfile('graphicDom.html');
});

app.get('/wheel', function(req, res){
  var year = req.param('year');
  readFiles('rzhd/'+year+'/', year, function(stringHtml){
    res.send(stringHtml);
  })
  
})

app.get('/album', function(req, res){
  var year = req.param('year');
  var wheel = req.param('wheel');
  var album = req.param('album');
  readFilesForAlbum('rzhd/'+year+'/'+wheel+'/'+album+'/', function(stringHtml){
    res.send(stringHtml);
  })
})


function readFiles(dirname, year, callback) {
  var filenames = fs.readdirSync(dirname);
  var stringHtml = '';
  for (var i in filenames) {
    var filename = filenames[i];
    if (filename.indexOf('.png') == -1) {
      stringHtml += '<div back="url(\'rzhd/1837/' + filename + '.png\')" class="wheel_dom">'
      var filenamesPic = fs.readdirSync(dirname + filename + '/');

      for (var j in filenamesPic) {
        var filenamePic = filenamesPic[j];
        if (filenamePic.indexOf('.png') != -1) {
          var foundFolder = filenamesPic.find(function(el){
            return el == filenamePic.split('.png')[0]
          })
          if(foundFolder){
            stringHtml += '<img class="image" type=album src="' + dirname + filename + '/' + filenamePic + '" card="album/?year=' + year +'&wheel='+ filename.split('.png')[0] + '&album=' + filenamePic.split('.png')[0] + '" header="" body=""/>'
          }else{
            stringHtml += '<img class="image" src="' + dirname + filename + '/' + filenamePic + '" card="' + dirname + filename + '/' + filenamePic + '" body="'+ dirname + filename + '/' + filenamePic.split('.png')[0] +'.json"/>'
          }
        }
      }
      stringHtml += '</div>';
    }
  }
  callback(stringHtml);
}

function readFilesForAlbum(dirname, callback) {
  var stringHtml = '<div class="card" style="width:0;height:0">'+
                      '<div class="img"/>'+
                      '<div class="div">'+
                        '<div></div>'+
                      '</div>'+
                      '<button onclick="appInstance.page.closeAlbum()"></button>'+
                  '</div>'+
                '<div class="album">';
  var filenames = fs.readdirSync(dirname);
  for(var i in filenames){
    var filename = filenames[i];
    if (filename.indexOf('.png') != -1) {
      stringHtml += '<img onclick="appInstance.page.changeAlbumPage(this)" src="'+dirname+filename+'" body="'+dirname+filename.split('.png')[0]+'.json"/>'
    }
  }
  stringHtml += '</div>';
  callback(stringHtml);
}

// запускаем сервер на порту 8083
app.listen(8083);
// отправляем сообщение
console.log('Сервер стартовал!');