// берём Express
var express = require('express');
var bodyParser = require('body-parser')
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
//email
var nodemailer = require('nodemailer');
//session
var session = require('express-session')
 , NedbStore = require('connect-nedb-session')(session);
//crypto
var crypto = require('crypto');

var db = new Datastore({filename : 'shoes'});
db.loadDatabase();

var usersdb = new Datastore({filename : 'users'});
usersdb.loadDatabase();

// Use with the session middleware (replace express with connect if you use Connect)
app.use(session({
  secret: 'secret_key',
  cookie: {
    path: '/',
    httpOnly: true
  }, 
  store: new NedbStore({ filename: 'shoes' })
}));




app.set('view engine', 'vash');

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/')));
// создаём маршрут для главной страницы
// http://localhost:8085/

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err + ' ' +  new Date().toDateString());
});

function index(req, res) {

  var _this = this;

  var type = (req.query&&req.query.type?req.query.type:'muzhskaya');
  var brands = (req.query&&req.query.brands?req.query.brands.split(','):[]);
  var page = (req.query&&req.query.page?req.query.page:1);
  var search = (req.query&&req.query.search?req.query.search:'');

  var pages = [];
  var allResults = [];
  var results = [];

  var re = new RegExp(search, 'i');

  if(type!="skidki"){
    if(brands.length){
      db.find({type: type, brand:{ $in: brands }, name:re}, function (err, docs) {
        _this.send(docs);
      });
    }else{
      db.find({type: type, name:re}, function (err, docs) {
        _this.send(docs);
      });
    }
  }else{
    if(brands.length){
      db.find({dibType: /skidka_prew/, brand: { $in: brands } , name:re}, function (err, docs) {
        _this.send(docs);
      });
    }else{
      db.find({dibType: /skidka_prew/, name:re}, function (err, docs) {
        _this.send(docs);
      });
    }
  }
  

  _this.send = function (docs){
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
      pages: pages,
      pageCur: page
    });
  }
}

function shoesSync(URL, callbackShoes){

  var lastURL = URL.split('/')[5];
  var leftURL = lastURL.split('?')[0];

  var dbCache = [];
  
  var q = tress(function (url, callback) {
    needle.get(url, function (err, res) {
      if (err) {
        console.log(err);
        callback();
        return;
      }

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
        var brand = '';
        var nameDiv = '';
        var bs = $(item).children('.name').children('b').toArray();
        bs.forEach(function(el, i){
          if(i==0){
            brand += $(el).text();
          }else{
            nameDiv += $(el).text()+"|";
          }
        });

        var oldPrice = '';
        var newPrice = '';
        var arrND = nameDiv.split('|');
        arrND.forEach(function(el, i){
          if(i == 0 && arrND.length == 3){
            oldPrice = el;
          }else if((i == 1 && arrND.length == 3) || (i == 0 && arrND.length == 2)){
            newPrice = el.replace( /^\D+/g, '');
          }
        });
        var detUrl = resolve(URL, item.attribs.href)
        needle.get(detUrl, function (err, res) {
          if (err) {
            console.log( err );
            return;
          }
          var $ = cheerio.load(res.body);

          description = $('.bl-good--sdesc').text();
          razmers = [];
          $('.ex-size li').each(function(el){
            var allstr = $($('.ex-size li')[el]).text().replaceAll('\t','').replaceAll('\n','');
            var retstr = allstr.substr(0,2) + '|' + allstr.substr(2,allstr.length).replaceAll(',','.');
            razmers.push(retstr);
          });
          articul = $('.article').text().replaceAll('\t','').replaceAll('\n','').split(" ")[1];
          
         
          var obj = {
            href:detUrl,
            imgPrev:picArr,
            name:pic.attribs.alt,
            brand:brand,
            nameDiv:nameDiv,
            oldPrice:oldPrice,
            newPrice:newPrice,
            dibType:divType?divType.attribs.class:null,
            type:leftURL,
            description:description,
            razmers:razmers,
            articul:articul
          };
          console.log(obj);
          dbCache.push(obj);
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
    typeof(callbackShoes)=='function'&&callbackShoes('true', dbCache);
  }

  q.push(URL);
}

app.get('/', function(req,res){
  index(req,res);
});

function encrypt(str, salt) {
  return crypto.createHmac('sha1', salt).
                update(str).
                digest('hex');
}
app.post('/register', function(req, res){
  var body = req.body;
  var salt = Math.round((new Date().valueOf() * Math.random())) + '';

  usersdb.findOne({username:username}, function(err, data){
    if(err || !data._id){
      res.send('false');
      return; 
    }
  });

  usersdb.insert({
      username:body.username,
      password:body.password,
      salt:salt,
      hashedPass:encrypt(body.password, salt),
      fio:body.fio,
      email:body.email,
      phone:body.phone,
      address:body.address,
      index:body.index
  }, function(err, data){
    if(err){
      res.send('false');
      return;
    }
    res.send('true');
  })
})

app.get('/logout', function(req, res){
  if (req.session) {
    req.session.destroy(function() {});
  }
  res.send('true');
})

app.get('/auth', function(req, res){
  var username = req.query.username;
  var password = req.query.password;
  usersdb.findOne({username:username}, function(err, data){
    if(err || !data || !data.username){
      res.send('false');
      return;
    }
    if(data.hashedPass == encrypt(password, data.salt)){
      req.session.user_id = data._id;
      res.send('true');
    }else{
      res.send('false');
    }
  })
})

app.get('/isAuth', function(req, res){
  var userid = req.session.user_id;
  usersdb.findOne({id:userid}, function(err, data){
    if(err || !data._id){
      res.send('false');
      return;
    }
    delete data.password;
    res.send(data);
  })
})

app.get('/getShoeByArt', function(req, res){
  var art = req.query.art;
  db.find({articul: art}, function (err, docs) {
    res.send(docs[0]);
  });
})

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cmuphob.k@gmail.com',
    pass: 'kashsp3win931994'
  }
});

app.post('/sendCart', function(req, res){
  var body = req.body;

  var shoesTable = '<table><thead><tr><th>Артикул</th><th>Размер</th><th>Количество</th></tr></thead><tbody>';
  for(var i in body.shoes){
    var shoe = body.shoes[i];
    shoesTable += '<tr><td>'+shoe.articul+'</td><td>'+shoe.razmer+'</td><td>'+shoe.count+'</td></tr>'
  }
  shoesTable += '</tbody></table>';
  
  var mailOptions = {
    from: body.email,
    to: 'cmuphob.k@gmail.com',
    subject: 'Оформление заказа',
    html: '<html lang="en">'+
            '<body>'+
              '<p><b>Имя:</b>'+body.name+'</p>'+
              '<p><b>Email:</b>'+body.email+'</p>'+
              '<p><b>Phone:</b>'+body.phone+'</p>'+
              '<p><b>Description:</b>'+body.desc+'</p></br>'+
              shoesTable+
            '</body>'+
          '</html>'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send('false')
    } else {
      console.log('Email sent: ' + info.response);
      res.send('true')
    }
  });

  
});

app.get('/shoesSynch', function(req, res) {
  var URL = 'http://fireboxshop.com/catalogue/obuv/muzhskaya?show=1';
  var res1 = null, res2 = null;
  var dbC1 = null, dbC2 = null;
  
  shoesSync(URL, function(result, dbCache){
    res1 = result;
    dbC1 = dbCache;
    if(res1 && res2){
      
      db.remove({}, { multi: true }, function (err, numRemoved) {
        var arr = dbC1.concat(dbC2)
        db.insert(arr, function (err, newDocs) {
          res.send('true');
          if(err){
            console.log(err + ' '  + new Date().toDateString());
          }else{
            console.log('synchSuccess ' + new Date().toDateString());
          }
        });
      });
    }
  });
  URL = 'http://fireboxshop.com/catalogue/obuv/zhenskaya?show=1';
  shoesSync(URL, function(result, dbCache){
    res2 = result;
    dbC2 = dbCache;
    if(res1 && res2){
     
      db.remove({}, { multi: true }, function (err, numRemoved) {
        var arr = dbC1.concat(dbC2)
        db.insert(arr, function (err, newDocs) {
          res.send('true');
          if(err){
            console.log(err + ' '  + new Date().toDateString());
          }else{
            console.log('synchSuccess '+ new Date().toDateString());
          }
        });
      });
    }
  });
  
});

String.prototype.replaceAll = function(search, replace){
  return this.split(search).join(replace);
}

setInterval(function(){
  var URL = 'http://fireboxshop.com/catalogue/obuv/muzhskaya?show=1';
  var res1 = null, res2 = null;
  var dbC1 = null, dbC2 = null;
  
  shoesSync(URL, function(result, dbCache){
    res1 = result;
    dbC1 = dbCache;
    if(res1 && res2){
      
      db.remove({}, { multi: true }, function (err, numRemoved) {
        var arr = dbC1.concat(dbC2)
        db.insert(arr, function (err, newDocs) {
          if(err){
            console.log(err + ' ' + new Date().toDateString());
          }else{
            console.log('synchSuccess '+ new Date().toDateString());
          }
        });
      });
    }
  });
  URL = 'http://fireboxshop.com/catalogue/obuv/zhenskaya?show=1';
  shoesSync(URL, function(result, dbCache){
    res2 = result;
    dbC2 = dbCache;
    if(res1 && res2){
     
      db.remove({}, { multi: true }, function (err, numRemoved) {
        var arr = dbC1.concat(dbC2)
        db.insert(arr, function (err, newDocs) {
          if(err){
            console.log(err + ' ' + new Date().toDateString());
          }else{
            console.log('synchSuccess '+ new Date().toDateString());
          }
        });
      });
    }
  });
}, 1000 * 60 * 60 * 24);

// запускаем сервер на порту 8085
var server = app.listen(8085);

server.timeout = 1000*60*60;
// отправляем сообщение
console.log('Сервер стартовал!');




var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});