$(document).ready(function(){

    /* video */

    var duration, step;
    document.getElementsByTagName('video')[0].onloadeddata = function(){
         duration = $('video')[0].duration;
         step = duration/3;
    }

    var count = 1;

    $.getJSON("json/text.json", function(json) {
        $('.big_label').text(JSON.stringify(json));
    });
    
    $('img').draggable({ 
        drag:function(event, ui){
            count++;
            $(event.target).css('z-index', count);
            $('body').scrollTop(0)
            $('body').scrollLeft(0)
            if(event.clientX < $("#body").offset().left+5 || event.clientX>$("#body").offset().left+$('#body').width()-15){
                event.preventDefault();
            }
            if(event.clientY < $("#body").offset().top+5 || event.clientY>$("#body").offset().top+$('#body').height()-15){
                event.preventDefault();
            }         
        }
    });

    function drawPoint1(){
        $('.bigerpoint').addClass('hidden_type')
        $('.big_body').removeClass('hidden_type')
        $('.point1').click();
    }

    function drawPoint2(){
        $('.bigerpoint').addClass('hidden_type')
        $('.big_body').removeClass('hidden_type')
        $('.point2').click();
    }

    function drawPoint3(){
        $('.bigerpoint').addClass('hidden_type')
        $('.big_body').removeClass('hidden_type')
        $('.point3').click();
    }

    $('.point').click(function(){
        if($(this).hasClass('point1')){
            $('.point').removeClass('active_point');
            $('.point1').addClass('active_point');

            $('#body').removeClass('hidden_type');
            $('#body2').addClass('hidden_type');
            $('#body3').addClass('hidden_type');
        }else if ($(this).hasClass('point2')){
            $('.point').removeClass('active_point');
            $('.point2').addClass('active_point');

            $('#body').addClass('hidden_type');
            $('#body2').removeClass('hidden_type');
            $('#body3').addClass('hidden_type');
        }else if ($(this).hasClass('point3')){
            $('.point').removeClass('active_point');
            $('.point3').addClass('active_point');

            $('#body').addClass('hidden_type');
            $('#body2').addClass('hidden_type');
            $('#body3').removeClass('hidden_type');
        }
    });

    $('.bigerpoint').click(function(){
        if($(this).hasClass('bigerpoint1')){
            drawPoint1();
        }else if($(this).hasClass('bigerpoint2')){
            drawPoint2();
        }else if($(this).hasClass('bigerpoint3')){
            drawPoint3();
        }
    })

    $('.bigpoint').click(function(){
        $('.bigpoint').addClass('hidden_type');
        $('.bigerpoint').addClass('hidden_type');
        $('.big_body').addClass('hidden_type')
        if($(this).hasClass('bigpoint1')){
            
            //играем до 1/3
            document.getElementsByTagName('video')[0].currentTime = 0;
            document.getElementsByTagName('video')[0].play();
            setTimeout(function(){
                $('.bigerpoint1').removeClass('hidden_type');
                document.getElementsByTagName('video')[0].pause();
                $('.bigpoint').removeClass('hidden_type');
            }, step*1000)
        }else if($(this).hasClass('bigpoint2')){
             
             //играем до 2/3
             document.getElementsByTagName('video')[0].currentTime = step;
             document.getElementsByTagName('video')[0].play();
             setTimeout(function(){
                $('.bigerpoint2').removeClass('hidden_type');
                document.getElementsByTagName('video')[0].pause();
                $('.bigpoint').removeClass('hidden_type');
             }, step*1000)
        }else if($(this).hasClass('bigpoint3')){
             
             //играем до 3/3
             document.getElementsByTagName('video')[0].currentTime = step*2;
             document.getElementsByTagName('video')[0].play();
             setTimeout(function(){
                 $('.bigerpoint3').removeClass('hidden_type');
                document.getElementsByTagName('video')[0].pause();
                $('.bigpoint').removeClass('hidden_type');
             }, step*1000)
        }
    })

});

