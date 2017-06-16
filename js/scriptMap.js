$(document).ready(function(){
    var lastX = null;
    var lastY = null;
    var startX = null;
    var startY = null;
    var timestampStart = null;
    var NFrame = 39;
    document.getElementById('mapDiv').addEventListener('mousedown', function(e){
        lastX = e.pageX;
        lastY = e.pageY;

        startX = e.pageX;
        startY = e.pageY;

        timestampStart = new Date().getTime();
    })

    document.getElementById('mapDiv').addEventListener('mouseup', function(e){
        lastX = null;
        lastY = null;

        startX = null;
        startY = null;
    })
    
    document.getElementById('mapDiv').addEventListener('mousemove', function(e){    
        if(startX && startY){
            var deltaY = e.pageY - startY;
            var deltaX = e.pageX - startX;

            deltaTimeStamp = new Date().getTime() - timestampStart;

            if(deltaTimeStamp >= 200 && Math.abs(deltaX) > 100){
                var speed = -deltaX/(deltaTimeStamp/1000); //px/sec
                
                var speedFrame = parseInt(speed/1000);

                showNewPage(speedFrame)

                function showNewPage(speedFrame){

                    var url = $('#map').attr('src');
                    var imageN = parseFloat(url.split('/')[2]);

                    if(speedFrame<0){
                        imageN--;
                    }else if(speedFrame>0){
                        imageN++;
                    }else{
                        return;
                    }
                    if(imageN == 0 && speedFrame<0){
                        return;
                    }

                    if(imageN == NFrame && speedFrame>0){
                        return;
                    }

                    $('#map').attr('src', 'img/map/'+imageN+'.png');
                    setTimeout(showNewPage, 200);
                }
            }

            lastX = e.pageX;
            lastY = e.pageY  
        }     
    })
})