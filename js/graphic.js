var canvas;

var sizeB = 30;

var img, img2, img3, img4;

var arcLine;

var xPress = 0, yPress = 0;

var x0 = 0, y0 = window.innerHeight/2, rx = 360, ry = window.innerHeight, rx2 = 360/2, ry2 = window.innerHeight/2;

var circle1,circle2,circle3;
var clickableArray = [];

var count = 0;
var isPressed = false;

var arrImages = [];

function setup(){
    
    img1 = loadImage("img/img0.png"); 
    img2 = loadImage("img/img1.png"); 
    img3 = loadImage("img/img2.png"); 
    img4 = loadImage("img/img3.png"); 

    canvas = createCanvas(window.innerWidth, window.innerHeight);

    $('canvas').css({
        position:'absolute',
        top:0,
        left:0
    });  
    
    circle1 = initCircle(0, function(){
        arrImages.push(randomizeImg(img1));
        arrImages.push(randomizeImg(img2));
    }), circle2 = initCircle(rx/3, function(){
        arrImages.push(randomizeImg(img2));
    }), circle3 = initCircle(rx/4, function(){
        arrImages.push(randomizeImg(img3));
    }), circle4 = initCircle(rx/6, function(){
        arrImages.push(randomizeImg(img4));
    });
    clickableArray = [circle1, circle2, circle3]
    
}

function randomizeImg(img){
    var rad = getRandomInt(0,4);
    var off;
    if(rad == 0){
        rad = 36;
    }else if(rad == 1){
        rad = -36;
    }else if(rad == 2){
        rad = 27;
    }else if(rad == 3){
        rad = -27;
    }
    var x = getRandomInt(window.innerWidth/3, window.innerWidth-300);
    var y = getRandomInt(0, window.innerHeight-300)
    var speed = getRandomInt(3,6);
    return {img:img, curX:0, curY:y, x:x, y:y, rad:rad, off: 0, w:200, h:200, speed:speed};
}


function initCircle(firstPositionOnLine, clickEvent,colored, border, coloredPress, borderPress){

    colored=colored?colored:color(220, 220, 220);
    border=border?border:color(80, 80, 80);

    coloredPress=coloredPress?coloredPress:color(204, 102, 0);
    borderPress=borderPress?borderPress:color(153, 52, 0);

    var xArr = [], xArrN = [], yArr = [], yArrN = [];
    for(var x=firstPositionOnLine; x<=rx/2; x+=0.3){
        xArr.push(x);
        var y = calculateYByXN(x);
        yArr.push(y);
    }

    for(var x = rx/2; x > 0; x-=0.3){
        xArr.push(x);
        var y = calculateYByX(x);
        yArr.push(y);
    }
    
    return {xs:xArr, ys:yArr, count:0, maxPoints:xArr.length-1, clickEvent, isPressed: false, xPress:0, yPress:0, colored: colored, border:border, coloredPress: coloredPress, borderPress: borderPress};
}


var pos = 0; 
function draw(){

    background(231);

    drawingImages();

    push();
    fill(220);
    stroke(120);
    arcLine = ellipse(x0, y0, rx, ry);
    pop();

    push();
    fill(235);
    stroke(120);
    for(var i in clickableArray){
        var el1 = clickableArray[i];
        if(el1.isPressed){
            push();
            fill(el1.coloredPress);
            stroke(el1.borderPress);
            ellipse(el1.xPress, el1.yPress, sizeB, sizeB);
            pop();
        }else{
            push();
            fill(el1.colored);
            stroke(el1.border);
            ellipse(el1.xs[el1.count], el1.ys[el1.count], sizeB, sizeB);
            pop();
            if(el1.count == el1.maxPoints){
                el1.count = 0;
            }else{
                el1.count++;
            }
        }
    }  
    pop();
}


function drawingImages(){
    for(var i in arrImages){
        var item = arrImages[i]; 
        var isRedraw = false;    
        if(item.curX<item.x){
            item.curX += item.speed;
            isRedraw = true;
        }
        if(item.curY<item.Y){
            item.curY += 5;
            isRedraw = true;
        }
        if(isRedraw){
            image(item.img, item.curX, item.curY, item.w, item.h);
        }else{
            image(item.img, item.curX, item.curY, item.w, item.h);
        }
        
    }
}


function mousePressed(e) {
    for(var i in clickableArray){
        var circle = clickableArray[i];
        var xPos = circle.xs[circle.count];
        var yPos = circle.ys[circle.count];
        if(e.pageX > xPos-15 && e.pageX < xPos+15 && e.pageY > yPos - 15 && e.pageY < yPos + 15){
            circle.isPressed = true;
        }
    } 
}

function mouseMoved(e) {
    for(var i in clickableArray){
        var circle = clickableArray[i];
        if(circle.isPressed){
            if(inTheArcLine(e.pageX, e.pageY)){
                circle.xPress = e.pageX;
                circle.yPress = e.pageY;
            }
        }
    }   
}

function mouseReleased(e){
    for(var i in clickableArray){
        var circle = clickableArray[i];
        if(circle.isPressed){
            circle.clickEvent();
            circle.isPressed = false;
        }        
    }
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

