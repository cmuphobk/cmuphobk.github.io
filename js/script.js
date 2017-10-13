
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

    if(!parseQueryString()['type'] || parseQueryString()['type'] == "" || parseQueryString()['type'] == "muzhskaya"){
        $($('#filters a')[0]).css({
            'text-decoration':'underline',
            'color': '#d62613',
        })
    }else if(parseQueryString()['type'] == "zhenskaya"){
        $($('#filters a')[1]).css({
            'text-decoration':'underline',
            'color': '#d62613',
        })
    }else{
        $($('#filters a')[2]).css({
            'text-decoration':'underline',
            'color': '#d62613',
        })
    }

    $('.controls .left').click(function(){
       var page = parseQueryString()['page'];
       if(!page){
            page = 1;
        }
       if(page == 1){
           return;
       }else{
           page--;
           window.location.href = setGetParameter('page', page);
       }
    });
    $('.controls .right').click(function(){
        var page = parseQueryString()['page'];
        if(!page){
            page = 1;
        }
        if(page == $('.controls a').last().attr('page')){
            return;
        }else{  
            page++;
            window.location.href = setGetParameter('page', page);
        }
    });
    $('.0').addClass('active');
    $('.shoes').each(function(el){
        var shoe = $('.shoes')[el];
        $(shoe).children('img').each(function(el){
            var img = $(shoe).children('img')[el];
            if(el == 0){
                $(img).addClass('active');
            }
        })     
    });
    $('.blocks span')
    $('.shoes .left').click(function(){
        var parent = $(this).parent();
        var th = parent.children('.active');
        var prev = th.prev();
        if(prev.is('span')){
            var last = parent.children('img').last();
            th.removeClass('active');
            last.addClass('active');
            parent.children('.blocks').children('.active').removeClass('active');
            parent.children('.blocks').children('.'+last.attr('attrin')).addClass('active');
            
        }else{
            th.removeClass('active');
            prev.addClass('active');
            parent.children('.blocks').children('.active').removeClass('active');
            parent.children('.blocks').children('.'+prev.attr('attrin')).addClass('active');
        }
    });
    $('.shoes .right').click(function(){
        var parent = $(this).parent();
        var th = parent.children('.active');
        var next = th.next();
        if(next.is('span')){
            var first = parent.children('img').first();
            th.removeClass('active');
            first.addClass('active');
            parent.children('.blocks').children('.active').removeClass('active');
            parent.children('.blocks').children('.'+first.attr('attrin')).addClass('active');
        }else{
            th.removeClass('active');
            next.addClass('active');
            parent.children('.blocks').children('.active').removeClass('active');
            parent.children('.blocks').children('.'+next.attr('attrin')).addClass('active');
        }
    });
    $('.blocks span').hover(function(){
        $(this).parent().parent().children('.active').removeClass('active');
        $(this).parent().children('.active').removeClass('active');
        $(this).addClass('active');
        $(this).parent().parent().children('[attrin='+parseInt($(this).attr('class'))+']').addClass('active');
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