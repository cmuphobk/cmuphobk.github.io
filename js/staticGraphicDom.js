$(document).ready(function(){
    
    window.allIntervals = [];
    
    //добавляем кнопки в таймлайн
    $('.timeline').append(
        '<button class="timeline1" onclick="clickTimeline1()"></button>'+
        '<button class="timeline2"></button>'+
        '<button class="timeline3"></button>'+
        '<button class="timeline4"></button>'+
        '<button class="timeline5"></button>'
    )

    //клик на первый таймлайн
    $('.timeline1').click(function(){
        $(this).addClass('active_btn');
    });

    //обработку клика по бэкграунду и смотрим координаты т.е. в какую кнопку кликнули
    $('.timeline .back').click(function(e){
        var x = e.pageX;
        var y = e.pageY;
        
        $('.timeline button').each(function(i){
            var btn = $('.timeline button')[i];
            var xB = $(btn).offset().left;
            var yB = $(btn).offset().top;
            var hB = 70;
            var wB = window.innerWidth/5;

            if(x>xB && y>yB && x<xB+wB && y<yB+hB){
                allTimelineClick();
                $('.timeline button').removeClass('active_btn');
                $(btn).addClass('active_btn');
                $(btn).click();
            }
        })     
    })
    $('.timeline1').click();
})

//функция обработчик клика на первую кнопку (1837год)
function clickButton1(){
    var video = document.getElementById('video');
    video.pause();
    $('.video_body').addClass('blur');
    $('.wheel_body').removeClass('hidden_type');
    setTimeout(function(){
        $('.wheel').css({
            'margin-left': '0px'
        })
    }, 100)
    
}

//функция вызываемая когда видео проигрывается до 13ой секунды
function sec13(e){
    if(e.currentTarget.currentTime >= 13){
        $('.video_body').append(
            '<button class="button1" onclick="clickButton1()"></button>'+
            '<button class="button2"></button>'+
            '<button class="button3"></button>'+
            '<button class="button4"></button>'+
            '<button class="button5"></button>'
        );
        var video = document.getElementById('video');
        video.removeEventListener('timeupdate', sec13);
    }

}

//клик на любой таймлайн - постаноа всех видосов в паузу, чистка интервалов
function allTimelineClick(){
    var videos = document.getElementsByTagName('video');
    for(var i in window.allIntervals){
        var interval = window.allIntervals[i];
        clearInterval(interval);
    }
    for(var i=0; i<videos.length; i++){
        var video = videos[i];
        video.pause();
        video.currentTime = 0;
        $(video).addClass('hidden_type');
        $(video).parent().children('button').remove();
    }
}

//функция обработчик клика в первый таймлайн
function clickTimeline1(){   
    
    var video = document.getElementById('video');
    video.play();
    $(video).removeClass('hidden_type')
    video.addEventListener('timeupdate', sec13)

    window.initFirstPage();
}

