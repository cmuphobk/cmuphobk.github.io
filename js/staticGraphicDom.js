$(document).ready(function(){
    setTimeout(function(){
        $('.video_body').append(
            '<button class="button1" onclick="clickButton1()"></button>'+
            '<button class="button2"></button>'+
            '<button class="button3"></button>'+
            '<button class="button4"></button>'+
            '<button class="button5"></button>'
        );
    }, 13000)
    
})

function clickButton1(){
    $('.button1').click(function(){
        var video = document.getElementById('video');
        video.pause();
        $('.video_body').addClass('blur');
        $('.wheel_body').removeClass('hidden_type');
    })
}