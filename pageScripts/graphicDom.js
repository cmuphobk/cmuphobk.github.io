var zIndexPhoto = -99999999;
var oldDeg = 90;
var isScrolled = false;
var stepG = 0;
var speedG = 3;

//обработчик мультитач
var oldLengthHeight = null;
var oldLengthWidth = null;
var oldRad = null;

var hardcodeImages = {
    1:[{
        lastHeight:470,
        lastLeft:430,
        lastTop:-100,
        rotate:-12
    }],
    2:[{
        lastHeight:400,
        lastLeft:300,
        lastTop:-100,
        rotate:-20
    },
    {
        lastHeight:400,
        lastLeft:800,
        lastTop:90,
        rotate:20
    }],
    3:[{
        lastHeight:468,
        lastLeft:353,
        lastTop:115,
        rotate:-40
    },
    {
        lastHeight:432,
        lastLeft:666,
        lastTop:-123,
        rotate:23
    },
    {
        lastHeight:414,
        lastLeft:1115,
        lastTop:77,
        rotate:-15
    }],
    4:[{
        lastHeight:300,
        lastLeft:250,
        lastTop:-100,
        rotate:20
    },
    {
        lastHeight:300,
        lastLeft:450,
        lastTop:250,
        rotate:-10
    },
    {
        lastHeight:300,
        lastLeft:750,
        lastTop:-100,
        rotate:-20
    },
    {
        lastHeight:300,
        lastLeft:950,
        lastTop:130,
        rotate:-35
    }],
    5:[{
        lastHeight:200,
        lastLeft:388,
        lastTop:3,
        rotate:20
    },
    {
        lastHeight:200,
        lastLeft:431,
        lastTop:200,
        rotate:-20
    },
    {
        lastHeight:200,
        lastLeft:728,
        lastTop:-61,
        rotate:20
    },
    {
        lastHeight:300,
        lastLeft:736,
        lastTop:174,
        rotate:-20
    },
    {
        lastHeight:300,
        lastLeft:1075,
        lastTop:234,
        rotate:20
    }],
    6:[{
        lastHeight:200,
        lastLeft:388,
        lastTop:3,
        rotate:20
    },
    {
        lastHeight:200,
        lastLeft:431,
        lastTop:200,
        rotate:-20
    },
    {
        lastHeight:300,
        lastLeft:736,
        lastTop:174,
        rotate:-20
    },
    {
        lastHeight:240,
        lastLeft:721,
        lastTop:-142,
        rotate:-20
    },
    {
        lastHeight:200,
        lastLeft:942,
        lastTop:23,
        rotate:20
    },
    {
        lastHeight:300,
        lastLeft:1075,
        lastTop:234,
        rotate:20
    }],
    7:[{
        lastHeight:200,
        lastLeft:362,
        lastTop:295,
        rotate:-20
    },
    {
        lastHeight:200,
        lastLeft:388,
        lastTop:3,
        rotate:20
    },
    {
        lastHeight:200,
        lastLeft:431,
        lastTop:200,
        rotate:-20
    },
    {
        lastHeight:300,
        lastLeft:736,
        lastTop:174,
        rotate:-20
    },
    {
        lastHeight:240,
        lastLeft:721,
        lastTop:-142,
        rotate:-20
    },
    {
        lastHeight:200,
        lastLeft:942,
        lastTop:23,
        rotate:20
    },
    {
        lastHeight:300,
        lastLeft:1075,
        lastTop:234,
        rotate:20
    }],
    8:[{
        lastHeight:200,
        lastLeft:362,
        lastTop:295,
        rotate:-20
    },{
        lastHeight:200,
        lastLeft:388,
        lastTop:3,
        rotate:20
    },
    {
        lastHeight:200,
        lastLeft:431,
        lastTop:200,
        rotate:-20
    },
    {
        lastHeight:300,
        lastLeft:736,
        lastTop:174,
        rotate:-20
    },
    {
        lastHeight:240,
        lastLeft:721,
        lastTop:-142,
        rotate:-20
    },
    {
        lastHeight:200,
        lastLeft:942,
        lastTop:23,
        rotate:20
    },
    {
        lastHeight:300,
        lastLeft:1075,
        lastTop:234,
        rotate:20
    },
    {
        lastHeight:250,
        lastLeft:900,
        lastTop:350,
        rotate:20
    }],
}

//Объект первой страницы - Синглтон
function FirstPage(){
    if (FirstPage.self) {
		return FirstPage.self
	}
    FirstPage.self = this;
    var self = this;
    
    self.video = null;
    self.videoSrc = null;
    self.buttons = null;
    self.seconds = null;

    self.htmlForWheel = null;
    self.jsonForCard = null;

    self.isShowButtons = false;

    self.currentWheel = null;

    self.unsetPage = function(){
        self.video.removeEventListener('timeupdate', self.timeUpdate)
    }

    //функция вызываемая когда видео проигрывается до заданной секунды
    
    self.secN = function(){
        self.isShowButtons = true;
        $('.video_body').children('button').remove();
        var buttonsHtml = self.buttons.map(function(el){
            return '<button style="height:'+el.h+'px; width:'+el.w+'px; top:'+el.y+'px; left:'+el.x+'px;" onclick="appInstance.page.clickOnButton(\''+el.json+'\')"></button>'
        })
        for(var i in buttonsHtml){
            $('.video_body').append(
                buttonsHtml[i]
            );     
        }
         
    }

    self.clickOnButton = function(urlJson){
        $('.timeline').css('display','none');

        self.video.pause();
        $('#video').addClass('blur');

        $('.wheel_body').removeClass('hidden_type');

        self.jsonForCard = appInstance.getContentFromFile(urlJson);
        
        $.ajax({
            url:'/wheel?year='+self.jsonForCard.year,
            type:'GET',
            async:false,
            success: function(res){
                self.htmlForWheel = res;
            }
        })

        var cardsHtml = '';
        cardsHtml += '<div class="layout_wheel" style="width:'+self.jsonForCard.width+';">';
            cardsHtml += '<label class="text_top" >'+self.jsonForCard.topText+'</label>';
            cardsHtml += '<label class="text_name">'+self.jsonForCard.topName+'</label>';
            
        cardsHtml += '</div>';
        cardsHtml += '<div class="description_body">';
        for(var i in self.jsonForCard.data){
            var card = self.jsonForCard.data[i];
            var cardHtml = '';
            cardHtml += '<div class="desc_item">';
                cardHtml += '<div class="desc_header">';   
                    if(i == 0){
                        cardHtml += '<label onclick="appInstance.page.clickOnYear()" class="text_year">'+self.jsonForCard.year+'</label>';
                        cardHtml += '<label class="text_header">'+card.headerText+'</label>';
                    }else{
                        cardHtml += '<label class="text_header fullW">'+card.headerText+'</label>';
                    }
                    
                    if(i == 0){
                        cardHtml += '<button onclick="appInstance.page.clickOnYear()" class="exit_card" ></button>';
                    }
                    var classBody = '';
                    if(i==1){
                        //reverse
                        classBody = 'reverse';
                    }
                cardHtml += '</div>';
                cardHtml += '<div class="desc_body '+classBody+'">';
                    cardHtml += '<div style="background-image:url('+card.imgUrl+');" class="desc_image"></div>';
                    cardHtml += '<div class="text_body">'+card.bodyText+'</div>';
                cardHtml += '</div>';
            cardHtml += '</div>';
            cardsHtml += cardHtml;
        }
        cardsHtml += '</div>';
        $('.wheel_body').append(cardsHtml)
        $('.description_body').css({
            'bottom' : 0
        })
        
    }

    self.clickOnYear = function(){
        $('.description_body').css({
            'bottom' : '-70%'
        })
        self.readyForWheel();
    }
    self.clickOnYearWheel = function(){
        $('.description_body').css({
            'bottom' : '0'
        })
        $('.wheel').css({
            'margin-left': '-100vw'
        })
    }

    self.clickOnExitCard = function(){
        $('.timeline').css('display','block');

        if(self.video.currentTime != self.video.duration){
            self.video.play();
        }
        $('#video').removeClass('blur');

        $('.wheel_body').addClass('hidden_type');

        $('.layout_wheel, .description_body').remove();
    }

    self.clickOnExit = function(){
        $('.wheel_dom .image').css({
            'display':'none',
        })
        $('.card').remove();
        $('.album').remove();
        
        $('.wheel').css({
            'margin-left': '-100vw'
        })
        setTimeout(function(){
            $('#video').removeClass('blur');
            $('.wheel_body').addClass('hidden_type');
            if(self.video.currentTime != self.video.duration){
                self.video.play();
            }
            
            $('.timeline').css('display','block');
        }, 1000)

        $('.description_body').css('display', 'none');
        
        $(window).off('mousemove');
    }

    //функция для построения колеса, вызывается при нажатии на кнопку
    self.readyForWheel = function(){
        
        //$('.wheel_body').append('<button class="exit" onclick="appInstance.page.clickOnExit()">x</button>');

        $('.wheel').children().remove();
        var data = self.htmlForWheel;
        $('.wheel').html(data);
        $('.wheel').append('<span class="wheel_span"><label onclick="appInstance.page.clickOnYearWheel()">'+self.jsonForCard.year+'</label></span>')
      
        
        setTimeout(function(){
            $('.wheel').css({
                'margin-left': '0px'
            })
        }, 100)

        self.initWheels();

        appInstance.clearIntervalsAll();
        //в интервале перерисоываем шарики, чтобы можно было менять атрибуты рилтайм
        var interval = setInterval(function(){
            self.drawCircles();
        },1)
        appInstance.allIntervals.push(interval);
    } 
    
    //инициализация карты
    //videoUrl - урл к видео
    //buttons массив кнопок, которые расположаться на видео
        //{x:координата Х, у: координата Y, h: высота кнопки, w: ширина кнопки, html: путь к шаблону колеса}
    //seconds - секунда на видео на которой нужно отрисовать кнопки
    self.initPage = function(videoUrl, buttons, seconds){

        var data = appInstance.getContentFromFile('templates/first.html');

        $('.video_body').html(data);
                
        self.buttons = buttons;
        self.seconds = seconds;

        self.isShowButtons = false;

        self.video = document.getElementById('video');
        self.video.setAttribute('src', videoUrl);
        self.video.setAttribute('type', 'video/mp4');
        /*self.videoSrc = document.createElement('source');
        self.videoSrc.setAttribute('id', 'videoSrc')
        self.video.appendChild(self.videoSrc);
        self.videoSrc.setAttribute('src', videoUrl);*/

        self.video.oncanplay = function() {
            self.video.play();
        }
        $(self.video).removeClass('hidden_type');
        self.video.addEventListener('timeupdate', self.timeUpdate)

        zIndexPhoto = -99999999;
        oldDeg = 90;
        isScrolled = false;
        stepG = 0;
        //при ресайзе окна перерисоываваем колесо, если надо
        $(window).off('resize').resize(function(){
            setTimeout(function(){
                self.initWheels();
            }, 1500);
        })

        document.body.removeEventListener('touchmove', null);
        //обрыв обработки евента при попадании на документ
        document.body.addEventListener('touchmove', function(event) {
            event.preventDefault();
        }, false); 

        //попытка залочить нативное перетягивание картинки (неудача, нереально)
        document.getElementsByTagName('img').ondragstart = function() { return false; };

        //клик по кнопке "Выход" - режим колеса
        /*$('.exit').off('click').click(function(e){  
            
        })*/
        
    }

    self.timeUpdate = function(e){
        if(e.currentTarget.currentTime >= self.seconds && !self.isShowButtons){
            self.secN();
            $(self.video).unbind('timeupdate');
        }
    }

    //рисуем шарики по заданному углу, навешиваем обработчики кликов по шарикам
    self.initWheels = function(){
        var d = $('.wheel_dom').length;
        stepG = 180 / (d);
        var wheels = $('.wheel_dom');
        wheels.each(function(i){
            var wheel = wheels[i];
            var deg = $('.wheel_dom').length%2==0?stepG * i:stepG * i + stepG / 2;
            $(wheel).attr('deg', deg)
        })
        //отрисовка
        self.drawCircles();
        //массив кругов на колесе
        var arrWheels = $('.wheel_dom');
        arrWheels.each(function(i){
            //круг
            var elementWheel = arrWheels[i];
            //клик по шарику
            elementWheel.addEventListener('mousedown', function(e){
                if($(e.srcElement).hasClass('wheel_dom')){
                    
                    self.clickWheel(this);
                }
            })
            //листенеры для свайпа
            document.getElementsByClassName('wheel')[0].addEventListener('touchstart', function(e){        
                this.startSwipeY = null;
                this.endSwipeY = null;
                var touch = e.touches[0];
                if(touch.pageX <= $('.wheel').width()/2 && touch.pageY <= $('.wheel').height()){
                    this.startSwipeY = touch.pageY;
                }
                
            })
            
            document.getElementsByClassName('wheel')[0].addEventListener('touchmove', function(e){
                var touch = e.touches[0];
                if(touch.pageX <= $('.wheel').width()/2 && touch.pageY <= $('.wheel').height()){
                    this.endSwipeY = touch.pageY;
                }
            })

            document.getElementsByClassName('wheel')[0].addEventListener('touchend', function(e){
                self.wheelMove(this);
                this.startSwipeY = null;
                this.endSwipeY = null;
            })

            //мутим на все картинки dragging
            self.addWheel($(elementWheel));
        });
    }


    //обработка свайпа
    self.wheelMove = function(el){
        var d = Math.abs(el.startSwipeY - el.endSwipeY);
        if(el.startSwipeY == null || el.endSwipeY == null || d < 15){
            return;
        }
        var newWheel;
        //свайп вниз: колесо против часовой
        if(el.startSwipeY < el.endSwipeY){
            
                var wheels = $('.wheel_dom');
                var minWheel = null;
                var minDiff = null;
                wheels.each(function(el){
                    var wheel = wheels[el];
                    var deg = parseInt($(wheel).attr('deg'));
                    var diff = deg - 90;
                    if(diff < 0){
                        if(minDiff == null || minDiff > diff){
                            minDiff = diff;
                            minWheel = wheel;
                        }
                    }
                })
                newWheel = minWheel;
            
        }
        //свайп вверх: колесо по часовой
        else if(el.startSwipeY > el.endSwipeY){
            
                var wheels = $('.wheel_dom');
                var minWheel = null;
                var minDiff = null;
                wheels.each(function(el){
                    var wheel = wheels[el];
                    var deg = parseInt($(wheel).attr('deg'));
                    var diff = deg - 90;
                    if(diff > 0){
                        if(minDiff == null || minDiff > diff){
                            minDiff = diff;
                            minWheel = wheel;
                        }
                    }
                })
                newWheel = minWheel;
            
        }
        self.clickWheel(newWheel);
    }

    self.drawCircles = function(){
        //массив кругов на колесе
        var arrWheels = $('.wheel_dom');
        arrWheels.each(function(i){
            //круг
            var elementWheel = arrWheels[i];

            //задаем бекграунд
            $(elementWheel).css({
                'background-image':$(elementWheel).attr('back')
            })

            //забираем градус и считаем X и Y - центр круга в колесе
            var deg = parseInt($(elementWheel).attr('deg'))*Math.PI/180;
            var radius = $('.wheel').width()/2;

            var C = Math.pow((2*Math.pow(radius,2)) - (2*Math.pow(radius,2)*Math.cos(deg)),0.5);
            var deg90 = 90*Math.PI/180;
            var deg180 = 180*Math.PI/180;
            var Y = A = Math.sin(deg90-(deg180-deg)/2) * C;
            var X = B = Math.pow(Math.pow(C,2) - Math.pow(A,2), 0.5);

            if(parseFloat($(elementWheel).attr('deg')) > 180){
                X = -X;
            }
            //Если приближаемся к 90deg, считаем коеффициент приближени и увеличиваем шарик
            if(parseFloat($(elementWheel).attr('deg')) >= 70 && parseFloat($(elementWheel).attr('deg')) <= 110){
                var deltaDeg = Math.abs(90 - parseFloat($(elementWheel).attr('deg')));
                var koeff = 1+Math.abs(deltaDeg - 20)/90;
                var sizeOld = 23;
                var newSize = sizeOld * koeff;
                $(elementWheel).css({
                    width: newSize + 'vh',
                    height: newSize + 'vh'
                });
            }else{
                $(elementWheel).css({
                    width: '23vh',
                    height: '23vh'
                });
            }

            $(elementWheel).css({
                top:Y - parseInt($(elementWheel).height()/2),
                left:X - parseInt($(elementWheel).width()/2) + parseInt(window.innerHeight/2) - window.innerHeight*0.05
            })

        });
    }



    //обработка нажатия на круг (куча анимаций)
    self.clickWheel = function(el){
        if(isScrolled){
            return;
        }
        isScrolled = true;
        var dom = $(el);

        self.currentWheel = el;

        var deg = parseFloat(dom.attr('deg'));

        //смещение на которое должен уехать каждый круг
        var delta = oldDeg - deg;
        var wheels = $('.wheel_dom');

        var oldDegSpan = self.getRotationDeg($('.wheel span'));

        var sum = (delta-1)*speedG;
        
        $('.wheel span').css({
            'transition': 'transform '+(sum/1000)+'s ease-in-out',
            //'transform': 'rotate('+(oldDegSpan+delta)+'deg)'
        })
       
        
        wheels.each(function(i){
            var wheel = wheels[i];
            
            for(var i=0; i<Math.abs(delta); i++){
                setTimeout(function(){
                    var nowDeg = parseInt($(wheel).attr('deg'));
                    if(delta<0){
                        $(wheel).attr('deg', nowDeg - 1);
                    }else{
                        $(wheel).attr('deg', nowDeg + 1);
                    }

                    function setTimeoutDeg(j, isTop){
                        
                        setTimeout(function(){
                            $(wheel).attr('deg', isTop?180-j:j)
                        }, j*speedG)

                        var d = $('.wheel_dom').length%2==0?stepG:stepG/2;
                        if(j < d) setTimeoutDeg(j+1, isTop)
                    }
                    var p = $('.wheel_dom').length%2==0?1:0;
                    if($(wheel).attr('deg') == 0-p){
                        setTimeoutDeg(1, true);
                    }
                    if($(wheel).attr('deg') == 180+p){
                        setTimeoutDeg(1, false)
                    }
                }, i*speedG)
                
            
            }
        })


        $('.wheel_dom .image').css({
            'transition':'none',
            'left':'50%',
            'top':'50%',
            'height':'0px',
            'width':'auto',
            'transform':'rotate(0deg)'
        })
        //TODO: подстановка атрибутов для картинок в зависимости от их количества
        var hardcode = hardcodeImages[dom.children('.image').length];
        setTimeout(function(){

            var el = dom.children('.image');
            el.each(function(i){
                var element = el[i];
                var hard = hardcode[i]
                $(element).css({
                    'transition': 'all 1s ease-in-out',
                    'top' : hard.lastTop+'px',
                    'left': hard.lastLeft+'px',
                    'height': hard.lastHeight +'px',
                    'width': 'auto',
                    'transform': 'rotate('+hard.rotate+'deg)'
                })
                setTimeout(function(){
                    $(element).css({
                        'transition':'none'
                    })
                }, 1000)
            });
            
            isScrolled = false;
            
        }, 1000)

    }

    //принимает евент и элемент с кастомными параметрами, по ним высчитывает его положение и перемещает
    self.addDraggableHandler = function(e, element){
        if(element.isClick){
            element.dragX = e.pageX-element.clickX;
            element.dragY = e.pageY-element.clickY;
        }else{
            element.dragX = null;
            element.dragY = null;
        }
        if(element.dragX != null && element.dragY != null && element.clickX != null && element.clickY != null){
            var deltaX = element.dragX;
            var deltaY = element.dragY;
            
            var newPosX = element.startPosX + deltaX;
            
            $(element).css('left', newPosX);

            $(element).css('top', element.startPosY + deltaY);

            
        }
    }


    var lastFirstTouch = null;
    var lastSecondTouch = null;
    //обработчик мультитач
    self.addResizeHandler = function(arrTouches, element){
        var width = $(element).width();
        var height = $(element).height();
        var firstTouch = arrTouches[0];
        var secondTouch = arrTouches[1];
        
        var lengthByHeight = Math.abs(firstTouch.pageY - secondTouch.pageY);
        var lengthByWidth = Math.abs(firstTouch.pageX - secondTouch.pageX);
        
        //ресайз по высоте
        if(lengthByHeight > lengthByWidth)  {
            if(oldLengthHeight != null){
                var delta = oldLengthHeight - lengthByHeight;
                if(delta != 0){
                    var otn = $(element).width()/$(element).height();
                    var newH = height - delta;
                    if(newH >= 60 && newH <= 800){
                        $(element).css('height', newH)
                    }           
                }   
            }
            oldLengthHeight = lengthByHeight;
        }
        
        //ресайз по ширине
        if(lengthByWidth > lengthByHeight)  {
            if(oldLengthWidth != null){
                var delta = oldLengthWidth - lengthByWidth;
                if(delta != 0){
                    var otn = $(element).height()/$(element).width();
                    var newH = (width - delta) * otn;
                    if(newH >= 60 && newH <= 800){ 
                        $(element).css('height', newH)
                    }
                }   
            }
            oldLengthWidth = lengthByWidth;
        }

        //rotate - вычисляем угол между тачами, высчитываем delta и поворачиваем

        var dx = secondTouch.pageX - firstTouch.pageX;
        var dy = secondTouch.pageY - firstTouch.pageY;

        var touchAngle=Math.atan2(dy,dx);
        
        if(oldRad != null){
            var deltaRad = (touchAngle - oldRad);
            var deltaUgol;
            
            deltaUgol = (deltaRad*57.2958);
            
            console.log(deltaUgol)
            if(deltaRad != 0){
                var elRot = self.getRotationDeg($(element));
                $(element).css({
                    transform: 'rotate('+(elRot+deltaUgol)+'deg)'
                })
            }
        }
        
        lastFirstTouch = firstTouch;
        lastSecondTouch = secondTouch;
        oldRad = touchAngle;
    }

    //получить поворот элемента по элементу
    self.getRotationDeg = function(obj) {
        var matrix = obj.css("-webkit-transform") ||
        obj.css("-moz-transform")    ||
        obj.css("-ms-transform")     ||
        obj.css("-o-transform")      ||
        obj.css("transform");
        if(matrix !== 'none') {
            var values = matrix.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
        } else { var angle = 0; }
        return (angle < 0) ? angle + 360 : angle;
    }

    //просто ансетит кастомные параметры и удаляет листенер mousemove с окна
    self.removeDraggableHandle = function(element){
        element.isClick = false;
        element.clickX = null;
        element.clickY = null;
        
        oldLengthHeight = null;
        oldLengthWidth = null;
        oldRad = null;
        
        $(element).off('mousedown')
        $(element).off('touchmove')

    }

    //добавить все обработчики на одно колесо
    self.addWheel = function(dom){
        var el = dom.children('.image');
        el.each(function(i){
            var element = el[i];
            
            //обработка draggable   
            element.isClick = false;
            element.clickX = null;
            element.clickY = null;
            element.dragX = null;
            element.dragY = null;
            element.startPosX = null;
            element.startPosY = null;

            $(element).off('mousedown')
            //события мыши по картинкам - выключил ибо пересекаются с тач событиями на стенде
            /*element.addEventListener('mousedown', function(e){

                    if(!element.isClick){
                        element.isClick = true;
                        element.clickX = e.pageX;
                        element.clickY = e.pageY;
                        element.startPosX = parseFloat($(element).css('left'));
                        element.startPosY = parseFloat($(element).css('top'));
                        zIndexPhoto++;
                        $(element).css('z-index', zIndexPhoto);
                        
                        window.addEventListener('mousemove', function(e){
                            self.addDraggableHandler(e, element);
                        }, false);
                        
                    }else{
                        self.removeDraggableHandle(element);
                        self.openCard(element);
                    }
                    

            }, false);*/
            
            //навешиваем обработку тач событий
            element.addEventListener('touchstart', function(e){
                    e = e.changedTouches[0];
                    element.isClick = true;
                    element.clickX = e.pageX;
                    element.clickY = e.pageY;
                    element.startPosX = parseFloat($(element).css('left'));
                    element.startPosY = parseFloat($(element).css('top'));
                    zIndexPhoto++;
                    $(element).css('z-index', zIndexPhoto);

                    //если после клика прошло 300ms и уже отжат - показываем карточку иначе двигаем или ресайзим
                    setTimeout(function(){
                        if(element.isClick == false){
                            // openCard  - открываем карточку
                            self.openCard(element);
                        }else{
                            element.addEventListener('touchmove', function(e){
                                var arrTouches = e.targetTouches;
                                //если тач один - двигаем, если два ресайзим или поворачиваем
                                if(arrTouches.length <= 1){
                                    e = e.changedTouches[0];
                                    self.addDraggableHandler(e, element);
                                }else if(arrTouches.length == 2){
                                    self.addResizeHandler(arrTouches, element)
                                }
                                
                            }, false);
                        }
                    },200)

                    
            })
            //обрубаем листенеры
            element.addEventListener('touchend', function(e){          
                self.removeDraggableHandle(element);
            });
            
        })
    }
    self.changeAlbumPage = function(el){
        $('.card .img').attr('style', 'background-image:url('+$(el).attr('src')+'); display:inline-block;')
        $('.card .div .card_header').html($(el).attr('header'))
        var body = appInstance.getContentFromFile($(el).attr('body'));
        var data = body?body.data:'';
        $('.card .div div').html(data)
    }
    self.closeAlbum = function(){
        $('.card .img, .card .div, .card button').css({
            display: 'none'
        })
        $('.card').css({
            transition: '.4s linear',
            width: 0,
            height: 0,
            left:'auto',
            top:'auto'
        })
        setTimeout(function(){
            $('.card').remove();
            $('.album').remove();
        }, 400) 
    }
    self.closeCard = function(){
        
        $('.card .img, .card .div, .card button').css({
            display: 'none'
        })
        $('.card').css({
            transition: '.4s linear',
            width: 0,
            height: 0,
            left:'auto',
            top:'auto'
        })
        setTimeout(function(){
            $('.card').remove();
            $('.album').remove();
        }, 400) 
    }
    //открываем карточку из фотографии
    self.openCard = function(element){
        $('.card').remove();
        $('.album').remove();
        var srcCard = $(element).attr('card');
        var x = $(element).offset().left + $(element).width()/2;
        var y = $(element).offset().top + $(element).height()/2;
        var card = '';
        var lHeight;
        if($(element).attr('type')!='album'){
            var body = appInstance.getContentFromFile($(element).attr('body'));
            var data = body?body.data:'';
            card += '<div class="card" style="left:'+x+'px;top:'+y+'px;width:0;height:0">';
                card += '<div class="img" style="background-image:url('+srcCard+')"/>'
                card += '<div class="div">'
                    card += '<div>'+ data +'</div>'
                card += '</div>'
                card += '<button onclick="appInstance.page.closeCard()"></button>'
            card += '</div>';
            lHeight = window.innerHeight-200
        }else{
            lHeight = window.innerHeight-400
            $.ajax({
                url:srcCard,
                type:'GET',
                async:false,
                success:function(res){
                    card = res;
                }
            });
        }
        
        $('body').append(card);

        $('.card').css({
            transition: 'none'
        })
        
        $('.card').animate({
            width: window.innerWidth-400,
            height: lHeight,
            left: 130,
            top: 80
        }, 400, function(){
            $('.card .img, .card button').css({
                display: 'inline-block'
            })
            $('.card .div').css({
                display: 'flex'
            })
        })

        if($(element).attr('type')=='album'){
            self.changeAlbumPage($('.album').children()[0])
        }
        
    }
}