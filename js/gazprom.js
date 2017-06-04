$(document).ready(function(){

var isRu = true;

setting();

var param = getQueryParams('lang', window.location.href);

if(param == 'rus'){
    isRu = true;
    setting();
}else if(param == 'eng'){
    isRu = false;
    setting();
}


$('.change_lang').click(function(){
    if(isRu){
        $('.change_lang').text('Рус');
    }else{
        $('.change_lang').text('Eng');
    }
    isRu = !isRu;
    setting();
})

function setting(){
    if(isRu){
        $('.ru').removeClass('hidden_type');
        $('.en').addClass('hidden_type');
    }else{
        $('.ru').addClass('hidden_type');
        $('.en').removeClass('hidden_type');
    }
}

function getQueryParams( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

//ApiKey:0uSqawSFlM35OUbC9svTxA
function sendEmail(req){
    emailjs.send("gmail","gazprom",req).then(function(response) {
        alert(isRu?'Регистрация прошла успешно. Спасибо за регистрацию.':'Registration has been successful. Thank you for registration.')
    }, 
    function(error) {
        alert(isRu?'Ошибка связи с сервером. Пожалуйста повторите попытку позже.':'Network error. Please try again later.')
    });
}

var req = {
    reply_to: '',
    copy_to: 'sifika90@gmail.com'
}
$('.sendRu').click(function(){
    Object.assign(req,{
       Name: $('#name_ru').val(),
       Country: $('#country_ru').val(),
       City: $('#city_ru').val(),
       Workplace: $('#workplace_ru').val(),
       Position: $('#position_ru').val(),
       Experience: $('#experience_ru').val(),
       AcDeg: $('#ac_deg_ru').val(),
       AcRank: $('#ac_rank_ru').val(),
       Email: $('#email_ru').val(),
       Phone: $('#phone_ru').val(),
       Fax: $('#fax_ru').val(),
       Index: $('#index_ru').val(),
       Date: $('#date_ar_ru').val() + '/' + $('#date_d_ru').val(),
       Time: $('#time_ar_ru').val() + '/' + $('#time_d_ru').val(),
       AviaTrain: $('#avia_ar_ru').val() + '/' + $('#avia_d_ru').val(),
       Placement: $('#place_ru').val(),
       DOC: $('#date_ru').val()
    })
    sendEmail(req);
})
$('.sendEn').click(function(){  
    Object.assign(req,{
       Name: $('#name_en').val(),
       Country: $('#country_en').val(),
       City: $('#city_en').val(),
       Workplace: $('#workplace_en').val(),
       Position: $('#position_en').val(),
       Experience: $('#experience_en').val(),
       AcDeg: $('#ac_deg_en').val(),
       AcRank: $('#ac_rank_en').val(),
       Email: $('#email_en').val(),
       Phone: $('#phone_en').val(),
       Fax: $('#fax_en').val(),
       Index: $('#index_en').val(),
       Date: $('#date_ar_en').val() + '/' + $('#date_d_en').val(),
       Time: $('#time_ar_en').val() + '/' + $('#time_d_en').val(),
       AviaTrain: $('#avia_ar_en').val() + '/' + $('#avia_d_en').val(),
       Placement: $('#place_en').val(),
       DOC: $('#date_en').val()
    })
    sendEmail(req);
})

});

