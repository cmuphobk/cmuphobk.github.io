function EarthPage(){
    if(EarthPage.self){
        return EarthPage.self;
    }else{
        EarthPage.self = this;
    }

    var self = this;

    self.unsetPage = function(){
        $('#earth_div').off('touchstart');
        $('#earth_div').off('touchend');
        $('#earth_div').off('touchmove');
    }
    
    //bounds
    //[[y1,x1],[y2,x2]]
    self.initPage = function(){

        self.earth = null;

        self.startX = null;
        self.startY = null;

        self.prevX = null;
        self.prevY = null;

        self.tilt = 0;

        var data = appInstance.getContentFromFile('templates/earth.html');

        $('.video_body').html(data);

        self.earth = new WE.map('earth_div', {
            sky:true,
            //atmosphere:true,
            dragging: false,
            minAltitude: 50000,
            maxAltitude: 2000000
        });
        
        var mapBounds = [[-85, -180], [85, 180]];
        var map = WE.tileLayer('img/earth/{z}/{x}/{y}.jpg', {
            bounds: mapBounds,
            minZoom: 0,
            maxZoom: 5,
            tms: true
        })
        map.addTo(self.earth);


        var bounds = [[45.12109165, 42.21535043], [48.02684804, 46.89989511]];
        self.layer = WE.tileLayer('img/earth/tile/{z}/{x}/{y}.png', {
            bounds:bounds,
            minZoom: 6,
            maxZoom: 6
        });
        self.layer.addTo(self.earth);
        
        
        self.earth.setView([45.309059, 34.473423],6)

        //self.earth.panInsideBounds(bounds);

        self.earth.setTilt(self.tilt);

        document.getElementById('earth_div').addEventListener('touchstart', function(e){
            if(e.touches.length == 1){
                var touch = e.touches[0];
                self.startX = touch.pageX;
                self.startY = touch.pageY;

                self.prevX = touch.pageX;
                self.prevY = touch.pageY;
            }
        })
        document.getElementById('earth_div').addEventListener('touchmove', function(e){
            if(e.touches.length == 1){
                var touch = e.touches[0];
                self.mover(touch);
            }
        })
        document.getElementById('earth_div').addEventListener('touchend', function(e){
            if(e.touches.length == 1){
                self.startX = null;
                self.startY = null;
                self.prevX = null;
                self.prevY = null;
            }
        })

        var interval = setInterval(function(){
            self.makeTiles();
        },50)
        appInstance.allIntervals.push(interval);

    }

    self.makeTiles = function(){
        var earth = self.earth;
        if(earth.getAltitude() >= 1500000){
            self.layer.setOpacity(0);
        }else{
            self.layer.setOpacity(1);
        }
    }
    
    self.mover = function(touch){
        if(self.startX && self.startY){
        var center = self.earth.getCenter();

        var deltaX = self.prevX - touch.pageX;
        var deltaY = touch.pageY - self.prevY;

        var earthX = center[1];
        var earthY = center[0];

        var earthLeftTopY = self.earth.getBounds()[0]
        var earthLeftTopX = self.earth.getBounds()[1]

        var earthRightBottomY = self.earth.getBounds()[2]
        var earthRightBottomX = self.earth.getBounds()[3]

        var newEarthX = earthX + deltaX/100;
        var newEarthY = earthY + deltaY/100;

        if(newEarthY > 70.669783 || newEarthY < 41.498412){
            newEarthY = earthY;
        }

        if(newEarthX < 32.300275 || newEarthX > 155.416406){
            newEarthX = earthX;
        }

        self.earth.setCenter([newEarthY, newEarthX]);
        self.earth.setTilt(self.tilt);

        self.prevX = touch.pageX;
        self.prevY = touch.pageY;

        }
    }

}