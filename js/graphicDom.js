var zIndexPhoto = 0;
var oldDeg = 90;
var isScrolled = false;
var stepG = 0;

//обработчик мультитач
var oldLengthHeight = null;
var oldLengthWidth = null;
var oldRad = null;

$(document).ready(function(){
 
    initFirstPage();
    
});

function initFirstPage(){
    zIndexPhoto = 0;
    oldDeg = 90;
    isScrolled = false;
    stepG = 0;
    //при ресайзе окна перерисоываваем колесо, если надо
    $(window).resize(function(){
        setTimeout(function(){
            initWheels();
        }, 1500);
    })

    //обрыв обработки евента при попадании на документ
    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false); 

    //попытка залочить нативное перетягивание картинки (неудача, нереально)
    document.getElementsByTagName('img').ondragstart = function() { return false; };

    //клик по кнопке "Выход" - режим колеса
    $('.exit').click(function(e){  
        $('.wheel_dom .image').css({
            'display':'none',
        })
        $('.card').remove();
        
        $('.wheel').css({
            'margin-left': '-100vw'
        })
        setTimeout(function(){
            $('.video_body').removeClass('blur');
            $('.wheel_body').addClass('hidden_type');
        }, 1000)
        
        $(window).off('mousemove');
    })
    
    initWheels();
    //в интервале перерисоываем шарики, чтобы можно было менять атрибуты рилтайм
    var interval = setInterval(function(){
        drawCircles();
    },1)
    window.allIntervals.push(interval);
}

//рисуем шарики по заданному углу, навешиваем обработчики кликов по шарикам
function initWheels(){
    stepG = 180 / ($('.wheel_dom').length + 1);
    var wheels = $('.wheel_dom');
    wheels.each(function(i){
        var wheel = wheels[i];
        $(wheel).attr('deg', stepG * (i+1))
    })
    //отрисовка
    drawCircles();
    //массив кругов на колесе
    var arrWheels = $('.wheel_dom');
    arrWheels.each(function(i){
        //круг
        var elementWheel = arrWheels[i];
        //клик по шарику
        elementWheel.addEventListener('mousedown', function(e){
            if($(e.srcElement).hasClass('wheel_dom') && !isScrolled){
                isScrolled = true;
                clickWheel(this);
            }
        })
        //мутим на все картинки dragging
        addWheel($(elementWheel));
    });
}

function drawCircles(){
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
function clickWheel(el){
    var dom = $(el);

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
function addDraggableHandler(e, element){
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
function addResizeHandler(arrTouches, element){
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
            var elRot = getRotationDeg($(element));
            $(element).css({
                transform: 'rotate('+(elRot+deltaUgol)+'deg)'
            })
        }
    }
    

    oldRad = rad;
}

//получить поворот элемента по элементу
function getRotationDeg(obj) {
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
 function removeDraggableHandle(element){
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
function addWheel(dom){
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
                        addDraggableHandler(e, element);
                    }, false);
                    
                }else{
                    removeDraggableHandle(element);
                    openCard(element);
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
                        openCard(element);
                    }else{
                        element.addEventListener('touchmove', function(e){
                            var arrTouches = e.targetTouches;
                            //если тач один - двигаем, если два ресайзим или поворачиваем
                            if(arrTouches.length <= 1){
                                e = e.changedTouches[0];
                                addDraggableHandler(e, element);
                            }else if(arrTouches.length == 2){
                                addResizeHandler(arrTouches, element)
                            }
                            
                        }, false);
                    }
                },200)

                
        })
        //обрубаем листенеры
        element.addEventListener('touchend', function(e){          
            removeDraggableHandle(element);
        });
        
    })
}

//открываем карточку из фотографии
function openCard(element){
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