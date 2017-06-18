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
        if(timestamp - self.startResizeTimestamp > 300){
            var dDelta = delta - self.startResizeDelta;
            if (dDelta > 50){
                //приближение
            }else if(dDelta < -50){
                //удаление
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
    }

}

