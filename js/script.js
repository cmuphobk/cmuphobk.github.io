
$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
        loop:true,
        nav:true,
        navText:['<img src="img/metarun/row.png"/>','<img src="img/metarun/row.png"/>'],
        autoplay:true,
        responsive:{
            0:{
                items:1
            }
        }
    });
    $('.header_menu').click(function(){
        if(window.innerWidth<768){
            if($('.header_menu').hasClass('header_menu_active')){
                $('.header_menu').removeClass('header_menu_active');
            }else{
                $('.header_menu').addClass('header_menu_active');
            }
        }
    });
    $('.left').click(function(){
       var page = parseQueryString()['page'];
       if(page == 1){
           return;
       }else{
           page--;
           window.location.href = setGetParameter('page', page);
       }
    });
    $('.right').click(function(){
        var page = parseQueryString()['page'];
        if(page == $('.controls a').last().attr('page')){
            return;
        }else{
            page++;
            window.location.href = setGetParameter('page', page);
        }
    });
});


var parseQueryString = function() {
    var str = window.location.search;
    var objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
};


function setGetParameter(paramName, paramValue)
{
    var url = window.location.href;
    var hash = location.hash;
    url = url.replace(hash, '');
    if (url.indexOf(paramName + "=") >= 0)
    {
        var prefix = url.substring(0, url.indexOf(paramName));
        var suffix = url.substring(url.indexOf(paramName));
        suffix = suffix.substring(suffix.indexOf("=") + 1);
        suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
        url = prefix + paramName + "=" + paramValue + suffix;
    }
    else
    {
    if (url.indexOf("?") < 0)
        url += "?" + paramName + "=" + paramValue;
    else
        url += "&" + paramName + "=" + paramValue;
    }
    return url + hash;
}