var zIndexPhoto = 0;
var oldDeg = 90;
var isScrolled = false;
var stepG = 0;
$(document).ready(function(){

    $(window).resize(function(){
        setTimeout(function(){
            initWheels();
        }, 1500);
    })

    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false); 

    document.getElementsByTagName('img').ondragstart = function() { return false; };

    $('.exit').click(function(e){  
        $('.wheel_dom .image').css({
            'display':'none',
        })
        $('.card').remove();
        $('.wheel_body').addClass('hidden_type');
        $('.wheel').css({
            'margin-left': '-100vw'
        })
        $('.video_body').removeClass('blur');
        $(window).off('mousemove');
    })
    
    initWheels();
    
});


function initWheels(){
    stepG = 180 / ($('.wheel_dom').length + 1);
    var wheels = $('.wheel_dom');
    wheels.each(function(i){
        var wheel = wheels[i];
        $(wheel).attr('deg', stepG * (i+1))
    })
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

        $(elementWheel).css({
            top:Y - parseInt($(elementWheel).height()/2),
            left:X - parseInt($(elementWheel).width()/2) + parseInt(window.innerHeight/2)
        })

    });
}

setInterval(function(){
    drawCircles();
},1)

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
var oldLengthHeight = null;
var oldLengthWidth = null;
var oldRad = null;
function addResizeHandler(arrTouches, element){
    var width = $(element).width();
    var height = $(element).height();
    var firstTouch = arrTouches[0];
    var secondTouch = arrTouches[1];
    
    var lengthByHeight = Math.abs(firstTouch.pageY - secondTouch.pageY);
    var lengthByWidth = Math.abs(firstTouch.pageX - secondTouch.pageX);
      
    if(lengthByHeight > lengthByWidth)  {
        if(oldLengthHeight != null){
            var delta = oldLengthHeight - lengthByHeight;
            if(delta != 0){
                $(element).css('height', height - delta)
            }   
        }
        oldLengthHeight = lengthByHeight;
    }
    
    
    if(lengthByWidth > lengthByHeight)  {
        if(oldLengthWidth != null){
            var delta = oldLengthWidth - lengthByWidth;
            if(delta != 0){
                $(element).css('width', width - delta)
            }   
        }
        oldLengthWidth = lengthByWidth;
    }

    
    var fTop = Math.abs(secondTouch.pageY - firstTouch.pageY);
    var fBot = Math.pow(Math.pow(secondTouch.pageX - firstTouch.pageX, 2) + Math.pow(secondTouch.pageY - firstTouch.pageY, 2), 0.5);
    var f = fTop/fBot;
    var rad = Math.asin(f);
    //TODO: rotate?
    if(oldRad != null){
        var deltaRad = oldRad - rad;
    }
    

    oldRad = rad;
}

//просто ансетит кастомные параметры и удаляет листенер mousemove с окна
 function removeDraggableHandle(element){
    element.isClick = false;
    element.clickX = null;
    element.clickY = null;
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
        

        element.addEventListener('touchstart', function(e){
                e = e.changedTouches[0];
                element.isClick = true;
                element.clickX = e.pageX;
                element.clickY = e.pageY;
                element.startPosX = parseFloat($(element).css('left'));
                element.startPosY = parseFloat($(element).css('top'));
                zIndexPhoto++;
                $(element).css('z-index', zIndexPhoto);

                setTimeout(function(){
                    if(element.isClick == false){
                        //TODO: openCard
                        openCard(element);
                    }else{
                        element.addEventListener('touchmove', function(e){
                            var arrTouches = e.targetTouches;
                            if(arrTouches.length <= 1){
                                e = e.changedTouches[0];
                                addDraggableHandler(e, element);
                                oldLengthHeight = null;
                                oldLengthWidth = null;
                                oldRad = null;
                            }else if(arrTouches.length == 2){
                                addResizeHandler(arrTouches, element)
                            }
                            
                        }, false);
                    }
                },500)

                
        })

        element.addEventListener('touchend', function(e){
            removeDraggableHandle(element);
        });
        
    })
}

function openCardMouse(element, callback){
    openCard(element)
    typeof(callback)=='function'&&callback();
}
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