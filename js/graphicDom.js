$(document).ready(function(){
    $('.circle').draggable({ 
        drag:function(event, ui){
            var x = ui.position.left;
            var y = ui.position.top;
        }
    });
});