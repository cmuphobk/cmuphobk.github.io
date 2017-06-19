$(document).ready(function(){
    var lastX = null;
    var lastY = null;
    var startX = null;
    var startY = null;
    var timestampStart = null;

    var pointR = 0;
    var video = document.getElementById('video');
    var abortVideo = document.getElementById('abortvideo');
    var isSwiped = false;
    document.getElementById('mapDiv').addEventListener('touchstart', function(e){
        var e = e.touches[0];
        lastX = e.pageX;
        lastY = e.pageY;

        startX = e.pageX;
        startY = e.pageY;

        timestampStart = new Date().getTime();
    })

    document.getElementById('mapDiv').addEventListener('touchend', function(e){
        lastX = null;
        lastY = null;

        startX = null;
        startY = null;
    })
    
    document.getElementById('mapDiv').addEventListener('touchmove', function(e){   
        var e = e.touches[0]; 
        if(startX && startY){
            var deltaY = startY - e.pageY;
            var deltaX = startX - e.pageX;

            deltaTimeStamp = new Date().getTime() - timestampStart;

            if(deltaTimeStamp <= 200 && deltaX > 100 && !isSwiped){
                //свайп вперед
                video.currentTime = pointR * (video.duration/4);
                if(video.currentTime != video.duration){
                    isSwiped = true;
                    
                    $(video).css('display','block');
                    $(abortVideo).css('display','none');
                    pointR+=1;
                    console.log(pointR);
                    video.play();
                    var time = video.currentTime;
                    video.ontimeupdate = function(){
                        if(video.currentTime - time >= video.duration/4){
                            video.pause();
                            isSwiped = false;
                            video.ontimeupdate = null;
                        }
                        
                    }
                    
                }
                
            }
            if(deltaTimeStamp <= 200 && deltaX < -100 && !isSwiped){
                //свайп назад  
                abortVideo.currentTime = (4-pointR) * (abortVideo.duration/4);
                if(abortVideo.currentTime != abortVideo.duration){
                    isSwiped = true;
                    $(abortVideo).css('display','block');
                    $(video).css('display','none');
                    pointR-=1;
                    console.log(pointR);
                    abortVideo.play();
                    var time = abortVideo.currentTime;
                    abortVideo.ontimeupdate = function(){
                        if(abortVideo.currentTime - time >= abortVideo.duration/4){
                            abortVideo.pause();
                            isSwiped = false;
                            video.ontimeupdate = null;
                        }
                        
                    }
                }
            }

            lastX = e.pageX;
            lastY = e.pageY  
        }     
    })
})