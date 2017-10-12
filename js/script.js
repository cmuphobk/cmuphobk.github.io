
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
});
