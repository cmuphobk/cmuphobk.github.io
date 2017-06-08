var appInstance = new StartApp();

$(document).ready(function(){
    
    appInstance.initApp();  

})

//объект приложения - синглтон
 function StartApp(){
    if(StartApp.self){
        return StartApp.self;
    }
    StartApp.self = this;
    var self = this;
    
    self.firstPage = null;

    self.allIntervals = [];

    self.getContentFromFile = function(url){
        var dataRet = null;
        $.ajax({ 
            url: url, 
            async:false, 
            success: function(data) {
                dataRet = data;
            } 
        });
        return dataRet;
    }

    self.initApp = function(){

        //клик по кнопке "Выход" - режим колеса
        $('.exit').off('click').click(function(e){  
            $('.wheel_dom .image').css({
                'display':'none',
            })
            $('.card').remove();
            
            $('.wheel').css({
                'margin-left': '-100vw'
            })
            setTimeout(function(){
                $('.video_body').removeClass('blur');
                $('.wheel_body').addClass('hidden_type');
            }, 1000)
            
            $(window).off('mousemove');
        })

        $('.timeline').children().remove();
        //добавляем кнопки в таймлайн
        $('.timeline').append(
            '<div class="back"></div>'+
            '<button class="timeline1" onclick="appInstance.clickTimeline1()"></button>'+
            '<button class="timeline2"></button>'+
            '<button class="timeline3"></button>'+
            '<button class="timeline4"></button>'+
            '<button class="timeline5"></button>'
        )

        //клик на первый таймлайн
        $('.timeline1').off('click').click(function(){
            $(this).addClass('active_btn');
        });

        //обработку клика по бэкграунду и смотрим координаты т.е. в какую кнопку кликнули
        $('.timeline .back').off('click').click(function(e){
            var x = e.pageX;
            var y = e.pageY;
            
            $('.timeline button').each(function(i){
                var btn = $('.timeline button')[i];
                var jBtn = $(btn);
                if(!(jBtn.hasClass('timeline2')||jBtn.hasClass('timeline3')||jBtn.hasClass('timeline4')||jBtn.hasClass('timeline5'))){
                    
                    var xB = $(btn).offset().left;
                    var yB = $(btn).offset().top;
                    var hB = 70;
                    var wB = window.innerWidth/5;

                    if(x>xB && y>yB && x<xB+wB && y<yB+hB){
                        
                        appInstance.allTimelineClick();
                        $('.timeline button').removeClass('active_btn');
                        $(btn).addClass('active_btn');
                        $(btn).click();
                    }
                }
            })     
        })
        $('.timeline1').click();
    }

    //функция обработчик клика в первый таймлайн
    self.clickTimeline1 = function(){
        //кнопочки их позиция, ширина, выстоа, и путь к шаблону рельс
        var buttons = [{
            x:190,
            y:40,
            h:100,
            w:340,
            html:'templates/wheel1.html'
        },
        {
            x:880,
            y:85,
            h:100,
            w:420,
            html:'templates/wheel2.html'
        },
        {
            x:595,
            y:215,
            h:105,
            w:425,
            html:'templates/wheel3.html'
        }]
       
        //инициализируем экран
        //1. путь к видео
        //2. массив кнопок на видео
        //3. секунда с которой появляются кнопочки
        self.firstPage = new FirstPage();
        self.firstPage.initFirstPage('img/rzhdMap.mp4', buttons, 13);
    }
    //функция обработчик клика во второй таймлайн
    self.clickTimeline2 = function(){
        var buttons = [{
            x:190,
            y:40,
            h:100,
            w:340,
            html:'templates/wheel1.html'
        }]
       
         //проверяем существует ли функция инициализации первого экрана 
        self.firstPage = new FirstPage();
        self.firstPage.initFirstPage('img/rzhdMap.mp4', buttons, 13);
    }

    //клик на любой таймлайн - постаноа всех видосов в паузу, чистка интервалов
    self.allTimelineClick = function(){
        var videos = document.getElementsByTagName('video');
        self.clearIntervalsAll();
        for(var i=0; i<videos.length; i++){
            var video = videos[i];
            video.pause();
            video.currentTime = 0;
            $(video).addClass('hidden_type');
            $(video).parent().children('button').remove();
        }
    }
    //чистим все интервалы а приложении, чтобы не занимали память
    self.clearIntervalsAll = function(){
        for(var i in self.allIntervals){
            var interval = self.allIntervals[i];
            clearInterval(interval);
        }
    }
}







