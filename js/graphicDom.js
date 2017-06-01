var zIndexPhoto = 0;
var oldDeg = 90;
var isScrolled = false;
$(document).ready(function(){

    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false); 

    document.getElementsByTagName('img').ondragstart = function() { return false; };

    $('.exit').click(function(e){  
        $('.wheel_dom .image').css({
            'display':'none',
        })
        window.removeEventListener('mousemove',null);
    })
    
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
        var deg = parseFloat($(elementWheel).attr('deg'))*Math.PI/180;
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
            top:Y - $(elementWheel).height()/2,
            left:X - $(elementWheel).width()/2 + window.innerHeight/2
        })

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

    
});

//обработка нажатия на круг (куча анимаций)
function clickWheel(el){
    var dom = $(el);

    var deg = parseFloat(dom.attr('deg'));
    

    $('.wheel').css({
        'transform':'rotate('+(oldDeg-deg)+'deg)'
    })
    dom.css({
        'transform':'rotate('+-(oldDeg-deg)+'deg)'
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
            'width':'0px',
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
                'width': $(el[i]).attr('lastWidth')+'px',
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
var oldLength = null;
function addResizeHandler(arrTouches, element){
    var width = $(element).width();
    var firstTouch = arrTouches[0];
    var secondTouch = arrTouches[1];
    var length = Math.pow(Math.pow(firstTouch.pageX - secondTouch.pageX, 2) + Math.pow(firstTouch.pageY - secondTouch.pageY, 2));

      
    if(oldLength != null){
        var delta = oldLength - length;
        $(element).css('width', width + delta)
    }
    
    oldLength = length;
}

//просто ансетит кастомные параметры и удаляет листенер mousemove с окна
 function removeDraggableHandle(element){
    element.isClick = false;
    element.clickX = null;
    element.clickY = null;
    element.removeEventListener('mousedown', null);
    element.removeEventListener('touchmove', null);
    window.removeEventListener('mousemove', null);
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

        element.addEventListener('mousedown', function(e){

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
            }

        }, false);
        

        element.addEventListener('touchstart', function(e){
                e = e.changedTouches[0];
                element.isClick = true;
                element.clickX = e.pageX;
                element.clickY = e.pageY;
                element.startPosX = parseFloat($(element).css('left'));
                element.startPosY = parseFloat($(element).css('top'));
                zIndexPhoto++;
                $(element).css('z-index', zIndexPhoto);

                element.addEventListener('touchmove', function(e){
                    var arrTouches = e.targetTouches;
                    if(arrTouches.length <= 1){
                        e = e.changedTouches[0];
                        addDraggableHandler(e, element);
                        oldLength = null;
                    }else if(arrTouches.length == 2){
                        addResizeHandler(arrTouches, element)
                    }
                    
                }, false);
        })

        element.addEventListener('touchend', function(e){
            removeDraggableHandle(element);
        });
        
    })
}