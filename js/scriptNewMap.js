function SecondPage(){

    if(SecondPage.self){
        return SecondPage.self;
    }else{
        SecondPage.self = this;
    }
    var self = this;

    self.unsetPage = function(){
        $('#mapDiv').off('touchstart');
        $('#mapDiv').off('touchend');
        $('#mapDiv').off('touchmove');
    }

    self.initPage = function(){

        var data = appInstance.getContentFromFile('templates/second.html');

        $('.video_body').html(data);

        self.startX = null;
        self.startY = null;
        self.startSec = null;
        self.video = document.getElementById('map');

        self.NFrame = 180;
        self.NSec = null;

        self.currentFrame = 0;

        self.canvasVideo = new CanvasVideoPlayer({
            videoSelector: '#map',
            canvasSelector: '#canvas'
        });

        self.initListeners();
    }

    self.initListeners = function(){
        document.getElementById('mapDiv').addEventListener('touchstart', function(e){
            if(e.touches.length == 1){
                var touch = e.touches[0];
                self.NSec = self.video.duration;
                self.startX = touch.pageX;
                self.startY = touch.pageY;
                self.startSec = self.video.currentTime;
            }else if(e.touches.length == 2){
                self.startResizeTimestamp = new Date().getTime();
                var ft = e.touches[0];
                var st = e.touches[1];
                self.startFirstTouch = ft.pageX<st.pageX?ft:st;
                self.startSecondTouch = ft.pageX<st.pageX?st:ft;
                self.startResizeDelta = Math.pow(Math.pow(self.startSecondTouch.pageX - self.startFirstTouch.pageX, 2) + Math.pow(self.startSecondTouch.pageY - self.startFirstTouch.pageY, 2), 0.5);
                
            } 
        })

        document.getElementById('mapDiv').addEventListener('touchend', function(e){
            if(e.touches.length == 1){
                self.startX = null;
                self.startY = null;
            }else if(e.touches.length == 2){
                self.startFirstTouch = null;
                self.startSecondTouch = null;
            }
        })


        document.getElementById('mapDiv').addEventListener('touchmove', function(e){ 
            if(e.touches.length == 1){
                var touch = e.touches[0];   
                self.mover(touch);
            }else if(e.touches.length == 2){
                var ft = e.touches[0];
                var st = e.touches[1];
                var firstTouch = ft.pageX<st.pageX?ft:st;
                var secondTouch = ft.pageX<st.pageX?st:ft;
                self.resize(firstTouch, secondTouch)
            }
        })
    }

    

    self.resize = function(firstTouch, secondTouch){
        var delta = Math.pow(Math.pow(secondTouch.pageX - firstTouch.pageX, 2) + Math.pow(secondTouch.pageY - firstTouch.pageY, 2), 0.5);
        var timestamp = new Date().getTime();

        var centerX = (secondTouch.pageX + firstTouch.pageX)/2;
        var centerY = (secondTouch.pageY + firstTouch.pageY)/2;

        if(delta < 900){
            var dDelta = delta - self.startResizeDelta;
            var zoom = dDelta/10;
            
            var canvas = document.getElementById('canvas');
            var wh = 1920/1080;
            var h =  $(canvas).height() + zoom;
            
            if(h >= 1080){
                var w = h * wh;
                var dh = (h - 1080)/2;
                var dw = (w - 1920)/2;
                $(canvas).height(h);
                $(canvas).width(w);
                $(canvas).css({
                    'top':-dh,
                    'left':-dw
                })

            }
                
        }
           
    }

    

    self.mover = function(e){
        if(self.startX && self.NSec){
            var nowX = e.pageX;
            var delta = self.startX - nowX;
            var deltaSec = (delta/1000);
            var currentTime = self.startSec + deltaSec;

            var posVideo = currentTime/self.NSec;
            var newFrame = parseInt(self.NFrame*posVideo);
            if(self.currentFrame != newFrame){
                self.currentFrame = newFrame;
                self.video.currentTime = currentTime;
            }
        }  
        var canvas = document.getElementById('canvas');
        if(self.startY && $(canvas).height() > 1080){
            var nowY = e.pageY;
            var delta = self.startY - nowY;
            var newTop = $(canvas).offset().top - (delta/100);
            if(newTop < 0 && newTop > -($(canvas).height()-1080)){
                $(canvas).css('top',newTop)
            }
            
        }
    }

}

