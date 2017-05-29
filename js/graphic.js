var canvas;

var sizeB = 30;

var img, img2, img3, img4;

var arcLine;

var xPress = 0, yPress = 0;

var isGameOver = false;
var isGameOverX = 0,isGameOverY = 0;

var x0 = 0, y0 = window.innerHeight/2, rx = 360, ry = window.innerHeight, rx2 = 360/2, ry2 = window.innerHeight/2;

var xArr = [], yArr = [], xArrN = [], yArrN = [];

var count = 0;
var isPressed = false;

var arrImages = [];

function setup(){
    
    img = loadImage("img/img0.png"); 
    img2 = loadImage("img/img1.png"); 
    img3 = loadImage("img/img2.png"); 
    img4 = loadImage("img/img3.png"); 

    arrImages.push(img);
    arrImages.push(img2);
    arrImages.push(img3);
    arrImages.push(img4);


    var count = 0;
    for(var x=0; x<=rx/2; x+=0.3){
        xArr.push(x);
        xArrN.push(x);
        var y = calculateYByX(x);
        yArr.push(y);
        var yn = calculateYByXN(x);
        yArrN.push(yn);
        count++;
    }

    for(var i in xArr){
        xArrN.push(xArr[(xArr.length-1)-i])
    }
    for(var i in yArr){
        yArrN.push(yArr[xArr.length-i])
    }

    canvas = createCanvas(window.innerWidth, window.innerHeight);

    $('canvas').css({
        position:'absolute',
        top:0,
        left:0
    });  
}


var pos = 0; 
var isDrawing = false;
function draw(){

    if(isDrawing)return;

    background(231);

    push();
    fill(220);
    stroke(120);
    arcLine = ellipse(x0, y0, rx, ry);
    pop();

    
    if(isGameOverX>window.innerWidth/2){
        drawingImages()
        isDrawing = true;
        return;
    }
    
    
    if(!isGameOver){
        sizeB = 30;
        if(!isPressed){
            push();
            fill(235);
            stroke(120);
            ellipse(xArrN[count], yArrN[count], sizeB, sizeB);
            //texture(arrImages[0]);
            pop();
        }else{
            push();
            fill(120);
            stroke(235);
            ellipse(xPress, yPress, sizeB, sizeB);
            //texture(arrImages[0]);
            pop();
        }
    }else{
        push();
        fill(235);
        stroke(120);
        ellipse(isGameOverX+=5, isGameOverY, sizeB+=0.3, sizeB+=0.3);
        //texture(arrImages[0]);
        pop();        
    }


    if(count == xArrN.length-1){
        count = 0;
    }else{
        count++;
    }
    
}


function drawingImages(){
    for(var i in arrImages){
        var item = arrImages[i];
        var rad = getRandomInt(0,4);
        var off
        if(item.rad == 0){
            rad = 36;
            off = item.y - window.innerHeight/2
        }else if(item.rad == 1){
            rad = -36;
            off = item.y + window.innerHeight/2
        }else if(item.rad == 2){
            rad = 27;
            off = item.y - window.innerHeight/2
        }else if(item.rad == 3){
            rad = -27;
            off = item.y + window.innerHeight/2
        }
    
        push()
        var x = getRandomInt(window.innerWidth/3, window.innerWidth-300);
        var y = getRandomInt(0, window.innerHeight-300)
        image(item, x, y, 200, 200);
        pop();

        push();
        fill(220);
        stroke(120);
        arcLine = ellipse(x0, y0, rx, ry);
        pop();
    }
}


function mousePressed(e) {
    if(isDrawing){
        isDrawing = false;
        isGameOverX = 0;
        sizeB = 30;
        isGameOver = false;
    }
    var xPos = xArrN[count];
    var yPos = yArrN[count];

    if(e.clientX > xPos-15 && e.clientX < xPos+15 && e.clientY > yPos - 15 && e.clientY < yPos + 15){
        isPressed = true;
    }
}

function mouseMoved(e) {
    if(isPressed){
        if(inTheArcLine(e.clientX, e.clientY)){
            xPress = e.clientX;
            yPress = e.clientY;
        }
        return;
    }    
}

function mouseReleased(e){

    if(isPressed){
        isGameOver = true;
        isGameOverX = e.clientX;
        isGameOverY = e.clientY;
    }
    isPressed = false;

}

function inTheArcLine(x, y){
    var koeff = (pow((x-x0),2)/pow(rx2,2)) + pow((y-y0),2)/pow(ry2,2)
    return koeff <= 1;
}

function calculateYByX(x){
    var scobec = pow((x-x0),2);
    var rx2c = pow(rx2,2);
    var ry2c = pow(ry2,2);
    var allInSqrt = (1-(scobec/rx2c))*ry2c;
    var sqrt = pow(allInSqrt, 0.5);

    return sqrt + y0;
}

function calculateYByXN(x){
    var scobec = pow((x-x0),2);
    var rx2c = pow(rx2,2);
    var ry2c = pow(ry2,2);
    var allInSqrt = (1-(scobec/rx2c))*ry2c;
    var sqrt = pow(allInSqrt, 0.5);

    return -sqrt + y0;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

