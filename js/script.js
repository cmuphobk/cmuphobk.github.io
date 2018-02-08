var brands = ['Adidas', 'Adidas Porsche', 'Asics', 'Converse', 'Diadora', 'Jordan', 'New Balance',
"Nike", 'Onitsuka Tiger', 'Puma', 'Reebok', 'Salomon', 'Saucony', 'Sprandi', 'Timberland', 'Under Armour', 'VANS'];

var razmers = [];

var strBrands = '';

$(document).ready(function(){

    autosize(document.querySelectorAll('textarea'));

    cartCountUpdate();

    $('.acc_div .acc').click(authorize);
    $('.reg_div .reg').click(register);


    $('.cart').click(openCarts);
    $('.account').click(openAccount);

    var brandsText = '<div id="brands" tabindex="0"><span>Бренды</span><ul>';
    var brandsAlready = decodeURI(parseQueryString()['brands']).split(',');
    var searchAlready = decodeURI(parseQueryString()['search']?parseQueryString()['search']:'');
    for(var i in brands){
        var brand = brands[i];
        if(brandsAlready.indexOf(brand)!==-1){
            brandsText += '<li class="active">'+brands[i]+'</li>';
            strBrands += brands[i]+' ';
        }else{
            brandsText += '<li>'+brands[i]+'</li>';
        }  
    }               
    brandsText += '<li class="button">Показать</li></ul></div>';

    var searchText = '<div><input type="search" value="'+searchAlready+'" class="search input" placeholder="Поиск"/><button class="search_btn glyphicon glyphicon-search"></button></div>';
    $('#filters').html(searchText + brandsText)

    setBrands();

    $('#brands ul li').click(function(){
        if(!$(this).hasClass('button')){
            if($(this).hasClass('active')){
                $(this).removeClass('active'); 
            }else{
                $(this).addClass('active');
            }
        }
    });

    $('.search').keypress(function(e){
        if(e.keyCode == 13){
            sendFilters();
        }   
    });
    $('#brands ul .button, .search_btn').click(function(){
        sendFilters();
    });


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
        $($('#filterss a')[0]).css({
            'text-decoration':'underline',
            'color': '#d62613',
        })
    }else if(parseQueryString()['type'] == "zhenskaya"){
        $($('#filterss a')[1]).css({
            'text-decoration':'underline',
            'color': '#d62613',
        })
    }else{
        $($('#filterss a')[2]).css({
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
           window.location.href = setGetParameter(window.location.href, 'page', page);
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
            window.location.href = setGetParameter(window.location.href, 'page', page);
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
    $('.shoes img').click(function(){
        var iImg=0;
        var shoe = $(this).parent();
        $('#myModal').modal('show');
        $('#myModal .img img').attr('src',shoe.children('img')[iImg].getAttribute('src'));
        $('#myModal .img').off().bind('click', function(){
            iImg++;
            var img = shoe.children('img')[iImg];
            if(img){
                $('#myModal .img img').attr('src', img.getAttribute('src'));
            }else{
                iImg=0;
                $('#myModal .img img').attr('src',shoe.children('img')[iImg].getAttribute('src'));
            }
            
        })
        $('#myModal .price').text(shoe.children('.newPrice').text());
        $('#myModal .articul').text(shoe.children('.articul').text());
        var table = shoe.children('.description').text().split('\n').slice(0,50);
        var description = shoe.children('.description').text().split('\n')[51];
        $('#myModal .description').text(description);
        var arr = shoe.children('.razmers').text().split(',');
        var razstr = '';
        for(var i in arr){
            var raz = arr[i];
            razstr += '<span attrraz="'+raz.split('|')[0]+'" attrtxt="'+raz.split('|')[1]+'">'+raz+'; </span>';
        }
        $('#myModal .razmers').html(razstr);

        $('#myModal .send_det_to_cart').click(function(){
            var spans = $('#myModal .razmers .active_span');
            spans.each(function(el){
                el = spans[el];
                var articul = $('#myModal .articul').text();
                var razmer = $(el).attr('attrraz');
                var razText = $(el).attr('attrtxt');
                if(razText != 'нет вналичии'){
                    addToCart(articul, razmer);
                    $('#myModal').modal('hide');
                    showMessage('Товар добавлен в корзину', '#26d613');
                }else{
                    showMessage('Этого размера нет в наличии', '#d62613');
                }
            })
                     
        });

        $('#myModal .razmers span').click(function(){
            var razText = $(this).attr('attrtxt');
            if(razText == 'нет вналичии'){
                showMessage('Этого размера нет в наличии', '#d62613');
            }else{
                if($(this).hasClass('active_span')){
                    $(this).removeClass('active_span')
                }else{
                    $(this).addClass('active_span')
                }
            }    
        });
    })
});


function showMessage(text, color){
    var strM = '<div class="msgC"><div class="msg" style="background:'+color+';">'+text+'</div></div>' 
    $('body').append(strM);
    setTimeout(function(){
        $('.msg').css({
            opacity: 0
        });
        setTimeout(function(){
            $('.msgC').remove();
        }, 1000);
    }, 1500);
}

function authorize(){
    var username = $('.acc_div .username').val();
    var password = $('.acc_div .password').val();
    $.ajax({
        url: '/auth?username='+username+'&password='+password,
        async: true,
        success: function(data){
            var isAuth = JSON.parse(data);
            if(isAuth){

            }else{

            }
        },
        error: function(e){
            console.log(e);
        }
    })
}

function register(){
    $.ajax({
        url: '/getShoeByArt?art='+cart.articul,
        async: false,
        success: function(data){
            cartFromServ = data;
        },
        error: function(e){
            console.log(e);
        }
    })
}

function updateCarts(){
    var carts = JSON.parse(window.localStorage.getItem('shoeCart'));
    var allhtml = '';
    for(var i in carts){
        var cart = carts[i];
        var cartFromServ = null;
        $.ajax({
            url: '/getShoeByArt?art='+cart.articul,
            async: false,
            success: function(data){
                cartFromServ = data;
            },
            error: function(e){
                console.log(e);
            }
        })
        if(cartFromServ == null || cartFromServ == ""){
            continue;
        }
        var htmlCart = '<div class="cart_item">'+
                            '<div>'+
                                '<img src="'+cartFromServ.imgPrev[0]+'"/>'+
                            '</div>'+
                            '<div>'+
                                '<label class="name_cart">'+cartFromServ.name+'</label>'+
                                '<label class="price_cart">'+cartFromServ.newPrice+'</label>'+
                                '<label class="articul_cart">'+cart.articul+'</label>'+
                                '<label class="razmer_cart">'+cart.razmer+'</label>'+
                                '<div>'+
                                    '<button class="plus" onclick="addToCart('+cart.articul+','+cart.razmer+'); updateCarts();">+</button>'+
                                    '<button class="minus" onclick="removeFromCart('+cart.articul+','+cart.razmer+'); updateCarts();">-</button>'+ 
                                    '<label class="count_cart">'+cart.count+'</label>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
        allhtml += htmlCart;      
    }
    allhtml += '<div><button class="send_cart btn">Оформить покупку</button>';
    allhtml += '<button class="clear_cart btn">Очистить корзину</button><div>';
    $('.cart_detail').html(allhtml);
    $('.send_cart').click(sendCart);
    $('.clear_cart').click(clearCart);
}

function sendCart(){
    $('#myModal1').modal('hide');
    $('#myModal2').modal('show');
    $('.btn_cart_send').click(congratulationSendCart);
}

function clearCart(){
    window.localStorage.setItem('shoeCart', '[]');
    showMessage('Корзина очищена.', '#26d613');
    $('#myModal1').modal('hide');
    cartCountUpdate();
}

function congratulationSendCart(){
    var objSend = {
        name:$('.name_cart_send').val(),
        email:$('.email_cart_send').val(),
        phone:$('.phone_cart_send').val(),
        desc:$('.description_cart_send').val(),
        shoes:JSON.parse(window.localStorage.getItem('shoeCart'))
    }
    $('.cart_send input, .cart_send textarea').val('');
    $.ajax({
        url: '/sendCart',
        type: 'POST',
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        data: JSON.stringify(objSend),
        success: function(res){
            window.localStorage.setItem('shoeCart', JSON.stringify([]));
            cartCountUpdate();
            $('#myModal2').modal('hide');
            showMessage('Покупка успешно оформлена. Дождитесь звонка специалиста.', '#26d613');
        },
        error: function(err){
            console.log(err);
        }
    });
    
}

function openCarts(){
    if($('.cart div').text() != '0'){
        updateCarts();
        $('#myModal1').modal('show');
    }    
}

function openAccount(){
    $('#myModal3').modal('show');
}

function addToCart(articul, razmer){
    var carts = JSON.parse(window.localStorage.getItem('shoeCart'));
    if(!carts || !Array.isArray(carts)){
        carts = [];
    }
    var obj = {articul:articul, razmer:razmer};
    var cartI = cartContain(obj);
    if(cartI){
        var cart = carts[cartI];
        cart.count++;
    }else{
        carts.push({articul:articul, razmer:razmer, count: 1});
    }
    
    window.localStorage.setItem('shoeCart', JSON.stringify(carts));
    cartCountUpdate();
}

function removeFromCart(articul, razmer){
    var carts = JSON.parse(window.localStorage.getItem('shoeCart'));
    if(!carts || !Array.isArray(carts)){
        carts = [];
    }
    var obj = {articul:articul, razmer:razmer};
    var cartI = cartContain(obj);
    if(cartI){
        var cart = carts[cartI];
        cart.count--;
        if(cart.count == 0){
            carts.splice(cartI, 1);
        }
    }
    
    window.localStorage.setItem('shoeCart', JSON.stringify(carts));
    cartCountUpdate();
}

function cartCountUpdate(){
    var carts = JSON.parse(window.localStorage.getItem('shoeCart'));
    for(var i in carts){
        var cart = carts[i];
        var cartFromServ = null;
        $.ajax({
            url: '/getShoeByArt?art='+cart.articul,
            async: false,
            success: function(data){
                cartFromServ = data;
            },
            error: function(e){
                console.log(e);
            }
        })
        if(cartFromServ == null || cartFromServ == ""){
            carts.splice(i, 1);
            window.localStorage.setItem('shoeCart', JSON.stringify(carts));
            continue;
        }
    }
    var count = 0;
    for(var i in carts){
        count += carts[i].count;
    }
    if(count == 0){
        $('#myModal1').modal('hide');
    }
    $('.cart div').text(count);
}

function cartContain(obj){
    var carts = JSON.parse(window.localStorage.getItem('shoeCart'));
    for(var i in carts){
        var cart = carts[i];
        if(cart.articul == obj.articul && cart.razmer == obj.razmer){
            return i;
        }
    }
    return null;
}

function setBrands(){
    if(strBrands == ""){
        strBrands = "Бренды";
    }
    if(strBrands != "Бренды"){
        strBrands = strBrands.slice(0, strBrands.length-1);
        $("#brands span").text(strBrands);
    }else{
        $("#brands span").text(strBrands);
    }
}

function sendFilters(){
    var activeBrands = $('#brands ul .active');
    var arrBrands = [];
    activeBrands.each(function(el){
        var text = $(activeBrands[el]).text();
        arrBrands.push(text);
    })
    var url = setGetParameter(window.location.href, 'brands',arrBrands);
    url = setGetParameter(url, 'search', $('.search').val());
    window.location.href = encodeURI(url);
}

