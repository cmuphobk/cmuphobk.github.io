$(document).ready(function(){


    
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
/*function sendEmail(req){
    emailjs.send("gmail","yanalovaCo",req).then(function(response) {
        
    }, 
    function(error) {
        
    });
}

var req = {
    reply_to: 'ksmirnov@baccasoft.ru',
    copy_to: 'ksmirnov@baccasoft.ru'
}
$('.sendEmail').click(function(){
    Object.assign(req,{
       Name: $('#name').val(),
       Email: $('#email').val(),
       Phone: $('#phone').val(),
    })
    sendEmail(req);
})*/

});

