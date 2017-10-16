// берём Express
var express = require('express');
var path = require('path')
// создаём Express-приложение
var app = express();
var fs = require('fs');
var process = require('process');
//parse
var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var Datastore = require('nedb');
var db = new Datastore({filename : 'shoes'});
db.loadDatabase();

app.set('view engine', 'vash');

app.use(express.static(path.join(__dirname, '/')));
// создаём маршрут для главной страницы
// http://localhost:8085/

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

function index(req, res) {
  var type = (req.query&&req.query.type?req.query.type:'muzhskaya');
  var page = (req.query&&req.query.page?req.query.page:1);

  var pages = [];
  var allResults = [];
  var results = [];

  if(type!="skidki"){
    db.find({type: type}, function (err, docs) {
      send(docs);
    }); 
  }else{
    db.find({ dibType: /skidka_prew/ }, function (err, docs) {
      send(docs);
    });
  }
  function send(docs){
    allResults = docs;
    for(var i=0; i<Math.round(allResults.length/20); i++){
      pages.push({
        number:i+1,
        href:'?type='+type+'&page='+(i+1)
      });
    }
    results = allResults.slice(page*20-20,page*20);
    res.render('index', {
      result: results,
      pages: pages
    });
  }
}

function shoesSync(URL, callbackShoes){

  var lastURL = URL.split('/')[5];
  var leftURL = lastURL.split('?')[0];
  
  var q = tress(function (url, callback) {
    needle.get(url, function (err, res) {
      if (err) throw err;

      // парсим DOM
      var $ = cheerio.load(res.body);

      var catalogue = $('.catalogue');
      //информация о новости
      var hrefs = $('.icat a');
      var elems = hrefs.nextAll(), count = elems.length;
      hrefs.each(function(i){
        var item = hrefs[i];
        var pic = $(item).children('.photos').children('.photo.p1').children('.timg').children('img')[0];
        var pic1 = $(item).children('.photos').children('.photo.p2').children('.timg').children('img')[0];
        var pic2 = $(item).children('.photos').children('.photo.p3').children('.timg').children('img')[0];
        var picArr = [];
        if(pic){
          picArr.push(resolve(URL, pic.attribs.src));
        }
        if(pic1){
          picArr.push(resolve(URL, pic1.attribs.src));
        }
        if(pic2){
          picArr.push(resolve(URL, pic2.attribs.src));
        }
        var divType = $(item).children('.photos').children('div')[3];
        var nameDiv = '';
        var bs = $(item).children('.name').children('b').toArray();
        bs.forEach(function(el){
          nameDiv += $(el).text()+"|";
        });
        var detUrl = resolve(URL, item.attribs.href)
        needle.get(detUrl, function (err, res) {
          if (err) throw err;
          var $ = cheerio.load(res.body);

          description = $('.bl-good--sdesc').text();
          razmers = [];
          $('.ex-size li').each(function(el){
            razmers.push($($('.ex-size li')[el]).text().replace('\t','').replace('\n',''));
          });
          articul = $('.article').text().replace('\t','').replace('\n','');
          
         
          var obj = {
            href:detUrl,
            imgPrev:picArr,
            name:pic.attribs.alt,
            nameDiv:nameDiv,
            dibType:divType?divType.attribs.class:null,
            type:leftURL,
            description:description,
            razmers:razmers,
            articul:articul
          };
          db.insert(obj);
        })
      });

      //паджинатор
      $('.link.next').each(function () {
        // не забываем привести относительный адрес ссылки к абсолютному
        q.push(resolve(URL, this.attribs.href));
      });

      callback();
    });
  }, 10); // запускаем 10 параллельных потоков

  q.drain = function () {
    typeof(callbackShoes)=='function'&&callbackShoes('true');
  }

  q.push(URL);
}

app.get('/', function(req,res){
  index(req,res);
});

app.get('/shoesSynch', function(req, res) {
  var URL = 'http://fireboxshop.com/catalogue/obuv/muzhskaya?show=1';
  var res1 = null, res2 = null;

  db.remove({}, { multi: true }, function (err, numRemoved) {
    shoesSync(URL, function(result){
      res1 = result;
      if(res1 && res2){
        res.send('true');
      }
    });
    URL = 'http://fireboxshop.com/catalogue/obuv/zhenskaya?show=1';
    shoesSync(URL, function(result){
      res2 = result;
      if(res1 && res2){
        res.send('true');
      }
    });
  });
});

// запускаем сервер на порту 8085
app.listen(8085);
// отправляем сообщение
console.log('Сервер стартовал!');