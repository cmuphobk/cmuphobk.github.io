$(document).ready(function(){

var oldScrollY = $(window).scrollTop() + $(window).height();
window.onscroll = function(e){
    var nowScrollY = $(window).scrollTop() + $(window).height();
    var elTop = $('.parallax').offset().top;
    if(nowScrollY >= elTop){
        var bPosY = parseFloat($('.parallax').css('background-position-y'));
        if(nowScrollY > oldScrollY){
            $('.parallax').css('background-position-y', bPosY - 0.5 + "%");
        }else{
            $('.parallax').css('background-position-y', bPosY + 0.5 + "%");
        }
        
    }
    oldScrollY = nowScrollY;
}
    
$('#menu span').click(function(){
    if($('#menu .right_panel ul').height() == 0){
        $('#menu .right_panel ul').css({
            "height":"auto"
        })
    }else{
        $('#menu .right_panel ul').css({
            "height":"0"
        })
    }
    
});


//ApiKey:0uSqawSFlM35OUbC9svTxA
function sendEmail(req){
    emailjs.send("gmail","yanalovamail",req).then(function(response) {
        
    }, 
    function(error) {
        
    });
}

//ApiKey:0uSqawSFlM35OUbC9svTxA
function sendCall(req){
    emailjs.send("gmail","yanalovacall",req).then(function(response) {
        
    }, 
    function(error) {
        
    });
}


var req = {
    reply_to: 'ksmirnov@baccasoft.ru',
    copy_to: 'ksmirnov@baccasoft.ru'
}
$('#send').click(function(){
    Object.assign(req,{
       Name: $('#name').val(),
       Email: $('#email').val(),
       Mail: $('#title').val(),
    })
    sendEmail(req);
})


$('#call').click(function(){
    Object.assign(req,{
       Name: $('#namecall').val(),
       Email: $('#emailcall').val(),
       Phone: $('#phone').val(),
    })
    sendCall(req);
})

});

