$(document).ready(function(){
    $('.wheel_dom1').click(function(){
        $('.wheel').css('transform','rotate(45deg)')

        $('.wheel_dom1').css('transform','rotate(-45deg)')
        setTimeout(function(){
            $('.wheel_dom .image1').css({
                'display':'block'
            })
            $('.wheel_dom .image2').css({
                'display':'block'
            })
            $('.wheel_dom .image3').css({
                'display':'block'
            })
            $('.wheel_dom .image1').animate({
                'margin-left':'400px'
            })
            $('.wheel_dom .image2').animate({
                'margin-left':'500px',
            })
            $('.wheel_dom .image3').animate({
                'margin-left':'600px',
            })
        }, 1000)
    })
    $('.wheel_dom2').click(function(){
        $('.wheel').css('transform','rotate(0deg)')
    })
    $('.wheel_dom3').click(function(){
        $('.wheel').css('transform','rotate(-45deg)')
        $('.wheel_dom3').css('transform','rotate(45deg)')
    })
});