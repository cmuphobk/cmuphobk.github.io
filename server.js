// берём Express
var express = require('express');
var path = require('path')
// создаём Express-приложение
var app = express();
var fs = require('fs');
//parse
var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;

app.set('view engine', 'vash');

app.use(express.static(path.join(__dirname, '/')));
// создаём маршрут для главной страницы
// http://localhost:8085/

var rmdir = function(dir) {
	var list = fs.readdirSync(dir);
	for(var i = 0; i < list.length; i++) {
		var filename = path.join(dir, list[i]);
		var stat = fs.statSync(filename);
		
		if(filename == "." || filename == "..") {
			// pass these files
		} else if(stat.isDirectory()) {
			// rmdir recursively
			rmdir(filename);
		} else {
			// rm fiilename
			fs.unlinkSync(filename);
		}
	}
	fs.rmdirSync(dir);
};

function index(req, res) {
  var type = (req.query&&req.query.type?req.query.type:'muzhskaya');
  var page = (req.query&&req.query.page?req.query.page:1);
  var path = './shoes'+type+'/'+type+page+'.json';
  var pages = [];
  
  fs.readFile( './shoes'+type+'/'+type+'all.json','utf8',function(err, contents) {
    var allRes = JSON.parse(contents);
    for(var i=0; i<Math.round(allRes.length/20); i++){
      pages.push({
        number:i+1,
        href:'?type='+type+'&page='+(i+1)
      });
    }
    var results = allRes.slice(page*20-20,page*20);
    res.render('index', {
      result: results,
      pages: pages
    });
    /*if (fs.existsSync(path)){
      fs.readFile(path, 'utf-8', function(err, result){
        res.render('index', {
            result: JSON.parse(result),
            pages: pages
        });
      });
    }*/
  });
  
}

function shoesSync(URL, callbackShoes){
  var allResults = [];

  var lastURL = URL.split('/')[5];
  var leftURL = lastURL.split('?')[0];
  
  var dir = './shoes'+leftURL;
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }else{
    rmdir(dir);
    fs.mkdirSync(dir);
  }
  var q = tress(function (url, callback) {
    needle.get(url, function (err, res) {
      if (err) throw err;

      // парсим DOM
      var $ = cheerio.load(res.body);

      var catalogue = $('.catalogue');
      //информация о новости
      var hrefs = $('.icat a');
      var elems = hrefs.nextAll(), count = elems.length;
      var results = [];
      hrefs.each(function(i){
        var item = hrefs[i];
        var pic = $(item).children('.photos').children('.photo.p1').children('.timg').children('img')[0];
        results.push({
          href:resolve(URL, item.attribs.href),
          imgPrev:resolve(URL, pic.attribs.src),
          name:pic.attribs.alt,
        });
        if (!--count) {
          var last = url.split('/')[5];
          var left = last.split('?')[0];
          var right = last.split('?')[1].split('=')[1].split('&')[0];
          fs.writeFile('./shoes'+leftURL+'/'+left+right+'.json', JSON.stringify(results, null, 4));
          allResults = allResults.concat(results);
        }
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
    fs.writeFile('./shoes'+leftURL+'/'+leftURL+'all.json', JSON.stringify(allResults, null, 4));
    typeof(callbackShoes)=='function'&&callbackShoes('true');
  }

  q.push(URL);
}

app.get('/', function(req,res){
  index(req,res);
});


app.get('/shoes', function(req, res){
  var path = './shoes/muzhskaya'+req.query.page+'.json';
  var results = [];
  if (fs.existsSync(path)){
    results = fs.readFileSync(path);
  }
  res.send(results);
});

app.get('/shoesSynch', function(req, res) {
  var URL = 'http://fireboxshop.com/catalogue/obuv/muzhskaya?show=1';
  var res1 = null, res2 = null;
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

// запускаем сервер на порту 8085
app.listen(8085);
// отправляем сообщение
console.log('Сервер стартовал!');