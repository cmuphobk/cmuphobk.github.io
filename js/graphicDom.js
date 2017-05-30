$(document).ready(function(){
    
    var zIndexPhoto = 0;
    //клик по 1
    $('.wheel_dom1').click(function(){
        $('.wheel').css('transform','rotate(60deg)')
        $('.wheel_dom1').css('transform','rotate(-60deg)')
    })
    //клик по 2
    $('.wheel_dom2').click(function(){
        
        $('.wheel').css('transform','rotate(0deg)')
    })
    //клик по 3
    $('.wheel_dom3').click(function(){
        $('.wheel').css('transform','rotate(-60deg)')
        $('.wheel_dom3').css('transform','rotate(60deg)')
    })
    //клик по любому
    var arrWheels = $('.wheel_dom');
    arrWheels.each(function(i){
        var elementWheel = arrWheels[i];
        elementWheel.addEventListener('mousedown', function(e){
            if($(e.srcElement).hasClass('wheel_dom')){
                clickWheel(elementWheel);
            }
        })
    });

    //обработка нажатия на круг (куча анимаций)
    function clickWheel(el){
        var dom = $(el);
        $('.wheel_dom .image').css({
            'display':'none',
        })
        setTimeout(function(){
            
            dom.children('.image').css({
                'display':'block',
                'margin-left':'0px',
                'margin-top':'0px',
                'height':'0px',
                'width':'0px',
                'transform':'rotate(0deg)'
            })
            
            var el = dom.children('.image');
            el.each(function(i){
                var element = el[i];
                $(element).animate({
                    'margin-top' : $(el[i]).attr('lastTop')+'px',
                    'margin-left': $(el[i]).attr('lastLeft')+'px',
                    'height': $(el[i]).attr('lastHeight')+'px',
                    'width': $(el[i]).attr('lastWidth')+'px',
                }, { 
                    step: function(){
                        $(el[i]).css('transform', 'rotate('+$(el[i]).attr('rotate')+'deg)');
                        setTimeout(function(){
                            $(element).css({
                                'transition':'none'
                            })
                        }, 1000)
                        
                    } 
                })
                
                //обработка draggable
                
                $(element).draggable({
                    start:function(event, ui){
                        zIndexPhoto++;
                        $(event.target).css('z-index', zIndexPhoto);
                    }
                }); 

                //обработка resizable
                
            })

            
        }, 1000)
    }
});