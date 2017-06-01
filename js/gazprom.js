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



});

