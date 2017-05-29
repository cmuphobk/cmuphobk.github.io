$(document).ready(function(){
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
    $('.wheel_dom').click(function(){
        var dom = $(this);
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
                $(el[i]).css({
                    'transform' : 'rotate('+$(el[i]).attr('rotate')+'deg)'
                })
                $(el[i]).animate({
                    'margin-top' : $(el[i]).attr('lastTop')+'px',
                    'margin-left': $(el[i]).attr('lastLeft')+'px',
                    'height': $(el[i]).attr('lastHeight')+'px',
                    'width': $(el[i]).attr('lastWidth')+'px'
                })
            })
        }, 1000)
    })
});