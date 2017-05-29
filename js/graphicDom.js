$(document).ready(function(){
    $('.wheel_dom1').click(function(){
        $('.wheel_dom .image').css({
            'display':'none',
        })
        $('.wheel').css('transform','rotate(45deg)')
        $('.wheel_dom1').css('transform','rotate(-45deg)')
    })
    $('.wheel_dom2').click(function(){
         $('.wheel_dom .image').css({
            'display':'none',
        })
        $('.wheel').css('transform','rotate(0deg)')
    })
    $('.wheel_dom3').click(function(){
         $('.wheel_dom .image').css({
            'display':'none',
        })
        $('.wheel').css('transform','rotate(-45deg)')
        $('.wheel_dom3').css('transform','rotate(45deg)')
    })
    $('.wheel_dom').click(function(){
        var dom = $(this);
        setTimeout(function(){
            
            dom.children('.image').css({
                'display':'block',
                'margin-left':'0px',
                'transform':'rotate(20deg)'
            })
            dom.children('.image1').animate({
                'margin-top' : '20px',
                'margin-left':'400px',
            })
            dom.children('.image2').animate({
                'margin-top' : '110px',
                'margin-left':'600px',
            })
            dom.children('.image3').animate({
                'margin-top' : '80px',
                'margin-left':'800px',
            })
        }, 1000)
    })
});