$(document).ready(function(){
    
    
    $('.timeline').append(
        '<button class="timeline1" onclick="clickTimeline1()"></button>'+
        '<button class="timeline2"></button>'+
        '<button class="timeline3"></button>'+
        '<button class="timeline4"></button>'+
        '<button class="timeline5"></button>'
    )

    $('.timeline1').click(function(){
        $(this).addClass('active_btn');
    });

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

function sec13(e){
    if(e.srcElement.currentTime >= 13){
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

function allTimelineClick(){
    var videos = document.getElementsByTagName('video');
    for(var i=0; i<videos.length; i++){
        var video = videos[i];
        video.pause();
        video.currentTime = 0;
        $(video).addClass('hidden_type');
    }
}

function clickTimeline1(){   
    var video = document.getElementById('video');
    video.play();
    $(video).removeClass('hidden_type')
    video.addEventListener('timeupdate', sec13)
}

function clickButton1(){
    $('.button1').click(function(){
        var video = document.getElementById('video');
        video.pause();
        $('.video_body').addClass('blur');
        $('.wheel_body').removeClass('hidden_type');
    })
}