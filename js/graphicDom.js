var zIndexPhoto = 0;
var oldDeg = 90;
var isScrolled = false;
var stepG = 0;

//обработчик мультитач
var oldLengthHeight = null;
var oldLengthWidth = null;
var oldRad = null;

//Объект первой страницы
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

    self.currentWheel = null;

    //функция вызываемая когда видео проигрывается до заданной секунды
    
    self.secN = function(){
        $('.video_body').children('button').remove();
        var buttonsHtml = self.buttons.map(function(el){
            return '<button style="height:'+el.h+'px; width:'+el.w+'px; top:'+el.y+'px; left:'+el.x+'px;" onclick="appInstance.firstPage.readyForWheel(\''+el.html+'\')"></button>'
        })
        for(var i in buttonsHtml){
            $('.video_body').append(
                buttonsHtml[i]
            );     
        }
         
    }

    //функция для построения колеса, вызывается при нажатии на кнопку
    self.readyForWheel = function(url){
        $('.wheel').children().remove();
        var data = appInstance.getContentFromFile(url)
        $('.wheel').html(data);

        self.video.pause();
        $('.video_body').addClass('blur');
        $('.wheel_body').removeClass('hidden_type');
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
    
    
    self.initFirstPage = function(videoUrl, buttons, seconds){
        
        self.buttons = buttons;
        self.seconds = seconds;

        self.video = document.getElementById('video');
        self.videoSrc = document.createElement('source');
        self.videoSrc.setAttribute('id', 'videoSrc')
        self.video.appendChild(self.videoSrc);
        self.videoSrc.setAttribute('src', videoUrl);
        self.video.play();
        $(self.video).removeClass('hidden_type');
        self.video.addEventListener('timeupdate', function(e){
            if(e.currentTarget.currentTime >= self.seconds){
                self.secN();
                $(self.video).unbind('timeupdate');
            }
        })

        zIndexPhoto = 0;
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
        
    }

    //рисуем шарики по заданному углу, навешиваем обработчики кликов по шарикам
    self.initWheels = function(){
        stepG = 180 / ($('.wheel_dom').length + 1);
        var wheels = $('.wheel_dom');
        wheels.each(function(i){
            var wheel = wheels[i];
            $(wheel).attr('deg', stepG * (i+1))
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
            
            document.getElementsByClassName('wheel')[0].addEventListener('touchstart', function(e){
                this.startSwipeY = null;
                this.endSwipeY = null;
                var touch = e.touches[0];
                this.startSwipeY = touch.pageY;
            })
            
            document.getElementsByClassName('wheel')[0].addEventListener('touchmove', function(e){
                var touch = e.touches[0];
                this.endSwipeY = touch.pageY;
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

    self.wheelMove = function(el){
        var newWheel;
        //свайп вниз: колесо против часовой
        if(el.startSwipeY < el.endSwipeY){
            if(self.currentWheel){
                newWheel = self.currentWheel.after();
            }else{
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
        }
        //свайп вверх: колесо по часовой
        else if(el.startSwipeY > el.endSwipeY){
            if(self.currentWheel){
                newWheel = self.currentWheel.before();   
            }else{
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
                var sizeOld = 15;
                var newSize = sizeOld * koeff;
                $(elementWheel).css({
                    width: newSize + 'vh',
                    height: newSize + 'vh'
                });
            }else{
                $(elementWheel).css({
                    width: '15vh',
                    height: '15vh'
                });
            }

            $(elementWheel).css({
                top:Y - parseInt($(elementWheel).height()/2),
                left:X - parseInt($(elementWheel).width()/2) + parseInt(window.innerHeight/2)
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
                        }, j*5)
                        if(j < stepG) setTimeoutDeg(j+1, isTop)
                    }

                    if($(wheel).attr('deg') == 0){
                        setTimeoutDeg(1, true);
                    }
                    if($(wheel).attr('deg') == 180){
                        setTimeoutDeg(1, false)
                    }
                }, i*5)
                
            
            }
        })


        $('.wheel_dom .image').css({
            'display':'none',
        })
        setTimeout(function(){
            
            dom.children('.image').css({
                'display':'block',
                'left':'0px',
                'top':'0px',
                'height':'0px',
                'width':'auto',
                'transition':'transform 1.2s, top 1s, left 1s',
                'transform':'rotate(0deg)'
            })

            var el = dom.children('.image');
            el.each(function(i){
                var element = el[i];
                $(element).animate({
                    'top' : $(el[i]).attr('lastTop')+'px',
                    'left': $(el[i]).attr('lastLeft')+'px',
                    'height': $(el[i]).attr('lastHeight')+'px',
                    'width': 'auto'//$(el[i]).attr('lastWidth')+'px',
                }, { 
                    step: function(){
                        $(el[i]).css('transform', 'rotate('+$(el[i]).attr('rotate')+'deg)');                    
                    } 
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
        var ft = firstTouch.pageX<secondTouch.pageX?firstTouch:secondTouch;
        var st = firstTouch.pageX<secondTouch.pageX?secondTouch:firstTouch;
        var fTop = Math.abs(st.pageY - ft.pageY);
        var fBot = Math.pow(Math.pow(st.pageX - ft.pageX, 2) + Math.pow(st.pageY - ft.pageY, 2), 0.5);
        var f = fTop/fBot;
        var rad = Math.asin(f);
        
        if(oldRad != null){
            var deltaRad = (oldRad - rad);
            var deltaUgol = deltaRad*57.2958;
            if(deltaRad != 0){
                var elRot = self.getRotationDeg($(element));
                $(element).css({
                    transform: 'rotate('+(elRot+deltaUgol)+'deg)'
                })
            }
        }
        

        oldRad = rad;
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

    //открываем карточку из фотографии
    self.openCard = function(element){
        $('.card').remove();
        var srcCard = $(element).attr('card');
        var x = $(element).offset().left + $(element).width();
        var y = $(element).offset().top; + $(element).height()
        var image = '<img class="card" src="'+srcCard+'" style="left:'+x+'px; top:'+y+'px;"/>';
        $('body').append(image);

        $('.card').click(function(e){
            $('.card').css({
                width: 0,
                height: 'auto',
            })
            setTimeout(function(){
                $('.card').remove();
            }, 1000)
            
        })
        
        setTimeout(function(){
            $('.card').css({
                top: 100,
                left: 200,
                width: window.innerWidth-400,
                height: 'auto',
            })
        }, 300)
        
    }
}