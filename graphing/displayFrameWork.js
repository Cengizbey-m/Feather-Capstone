const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const container = document.getElementById("asset_container").getBoundingClientRect();
canvas.width = container.width;
canvas.height = container.height

const candleGreen = "#388E3C";
const candleRed = "#D32F2F";
const wickColour = "#EEEEEE"

const uiGreen = "#2BD56A";
const uiRed = "#FF3E51";
const uiGrey = "#ffffff";

const chartLineColour = "#37474F";
const chartBackground = "#121212";

const maxCandleWidth = 80;
const minCandleWidth = 1;

const smallButtonWidth = 30;
const smallButtonHeight = 20;

const largeButtonWidth = 35;
const largeButtonHeight = 25;

const keysPressed = {};

let mx = my = mxPrev = myPrev = 0;
let mouseDownAnchorY = -1;
let moveMouseY = false;

let wickWidth = 1;
let candleWidth = 5;
let buttonAlpha = 1;

let md = false;
let mu = false;
let wheelDeltaY = 0;
let kd = false;

let cameraX = 0;
let cameraY = 0;

let userScaleY = 0;

class Candle{
    constructor(high, open, close, low, timestamp){
        this.high = high;
        this.open = open;
        this.close = close;
        this.low = low;
        this.timestamp = timestamp;
    }

    render(x, candleArrayLow, candleArrayHigh){
        let margin = canvas.height * 0.05; // 5 percent margin
        let bottomMargin = canvas.height - margin;
        let scaleY = (canvas.height - (margin * 2)) / ((candleArrayHigh - candleArrayLow) + userScaleY);

        let highY  = bottomMargin - ((this.high  - candleArrayLow) * scaleY);
        let lowY   = bottomMargin - ((this.low   - candleArrayLow) * scaleY);
        let openY  = bottomMargin - ((this.open  - candleArrayLow) * scaleY);
        let closeY = bottomMargin - ((this.close - candleArrayLow) * scaleY);

        ctx.fillStyle = wickColour;
        ctx.fillRect((x + (Math.floor(candleWidth/2))), highY + cameraY, wickWidth, (lowY - highY));

        /* render perfect doji */
        if(this.open == this.close)
            closeY++;
        else
            ctx.fillStyle = this.close >= this.open ? candleGreen : candleRed;

        ctx.fillRect(x, openY + cameraY, candleWidth, closeY - openY);
    }
}

class Button{
    constructor(x, y, w, h, str){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.str = str;
    }

    render(radi){
        let textWidth = ctx.measureText(this.str).width;
        let textHeight = 17;
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.w, this.h, radi);
        ctx.fill();

        ctx.font = textHeight + "px monospace";
        ctx.fillStyle = "#000000";
        ctx.fillText(this.str, (this.x + this.w/2) -  textWidth/2, (this.y + this.h/2) + textHeight/3);
    }

    mouseOver(mx, my){
        return mx >= this.x && mx <= this.x + this.w && my >= this.y && my <= this.y + this.h;
    }
}

function findLowHigh(candleArray){
    let high = candleArray[0].high;
    let low = candleArray[0].low;
    for(let i = 0; i < candleArray.length; i++)
        if(candleArray[i].high > high)
            high = candleArray[i].high;
        else if(candleArray[i].low < low)
            low = candleArray[i].low;
    
    return [low, high];
}

function clamp(n, min, max){
    if(n < min)
            return minCandleWidth;
    if(n > max)
        return maxCandleWidth;
    return n;
}

function parseCSV(data){
    result = [];
    let lines = data.split('\n');
    lines = lines.slice(1);

    for(let i = 0; i < lines.length; i++){
        j = lines[i].split(',');
        result.push(new Candle(Number(j[1]), Number(j[0]), Number(j[3]), Number(j[2]), Number(j[5])));
    }
    return result;
}

function lerp(start, end, amount){
    return start + amount * (end - start);
}

/* using log for scaling so zooming isn't painfully linear */
function zoomIn(){
    let oldSpacing = candleWidth + (candleWidth  / 2);
    let centerCandle = cameraX + (canvas.width / 2) / oldSpacing;
        
    candleWidth += Math.log(candleWidth + 1) * 2;
    candleWidth = clamp(candleWidth, minCandleWidth, maxCandleWidth);
        
    let newSpacing = candleWidth + (candleWidth / 2);
    cameraX = centerCandle - (canvas.width / 2) / newSpacing;

}

function zoomOut(){
        let oldSpacing = candleWidth + (candleWidth / 2);
        let centerCandle = cameraX + (canvas.width / 2) / oldSpacing;
        
        candleWidth -= Math.log(candleWidth + 1) * 2;
        candleWidth = clamp(candleWidth, minCandleWidth, maxCandleWidth);
        
        let newSpacing = candleWidth + (candleWidth / 2);
        cameraX = centerCandle - (canvas.width / 2) / newSpacing;
}

let candleArray = [];

init(); // function declaired by user in main.js

/* make the graph start at the latest candles */
let candleSpacing = candleWidth + (candleWidth / 2);
cameraX = candleArray.length - (canvas.width / candleSpacing);
let startingCandle = Math.floor(cameraX);
let endingCandle = candleArray.length;

let o, h, l, c;

const fps = 60;
const msps = 1000 / fps;

let prevWindowWith = canvas.width;
let prevWindowHeight = canvas.height;

let plusButton = new Button(0, 0, smallButtonWidth, smallButtonHeight, "+");
let minusButton = new Button(0, 0, smallButtonWidth, smallButtonHeight, "-");
let leftButton = new Button(0, 0, smallButtonWidth, smallButtonHeight, "❬");
let rightButton = new Button(0, 0, smallButtonWidth, smallButtonHeight, "❭");
let resetButton = new Button(0, 0, smallButtonWidth, smallButtonHeight, "⟲"); // ⛶
let expandButton = new Button(0, 0, smallButtonWidth, smallButtonHeight, "⛶");

let candleArrayOldLength = candleArray.length; // used for scrolling
let scrollVelocity = 0;

let _input = function(){
    /* mouse down */
    if(mu){
        mouseDownAnchorY = -1;
        moveMouseY = false;

        if(plusButton.mouseOver(mx, my))
            zoomIn();

        if(minusButton.mouseOver(mx, my))
            zoomOut();

        if(resetButton.mouseOver(mx, my)){
            userScaleY = 0;
            candleWidth = 5;
            candleSpacing = candleWidth + (candleWidth / 2);
            cameraX = candleArray.length - (canvas.width / candleSpacing);
            cameraY = 0;
            startingCandle = Math.floor(cameraX);
            endingCandle = candleArray.length;
        }

        if(expandButton.mouseOver(mx, my)){
            while(candleWidth >= 3)
                zoomOut();
        }
    }

    /* mouse wheel */
    if(wheelDeltaY != 0){
        let oldSpacing = candleWidth + (candleWidth / 2);
        let centerCandle = cameraX + (canvas.width / 2) / oldSpacing;

        let velocity = Math.log(candleWidth + 1) / 5;
        velocity = wheelDeltaY > 0 ? velocity : -velocity;

        candleWidth += velocity;
        candleWidth = clamp(candleWidth, minCandleWidth, maxCandleWidth);

        let newSpacing = candleWidth + (candleWidth / 2);

        cameraX = centerCandle - (canvas.width / 2) / newSpacing;
    }

    /* key down */
    if(kd){
        if(keysPressed["_"])
            userScaleY += .05;

        if(keysPressed["+"])
            userScaleY -= .05;

        if(keysPressed["-"])
                zoomOut();

        if(keysPressed["="])
                zoomIn();

        if(keysPressed["ArrowRight"])
            mx += keysPressed["Shift"] ? candleSpacing * 5 : candleSpacing;

        if(keysPressed["ArrowLeft"])
            mx -= keysPressed["Shift"] ? candleSpacing * 5 : candleSpacing;

        if(keysPressed["ArrowDown"])
            my += keysPressed["Shift"] ? canvas.height * .2 : canvas.height * .01;

        if(keysPressed["ArrowUp"]){
            my -= keysPressed["Shift"] ? canvas.height * .2 : canvas.height * .01;
            if(my < 0)
                my = 0;
        }
    }
}

let _update = function(){
    canvas.style.cursor = "crosshair";

    update(); // function declaired by user in main.js

    /* check if user is trying to move the camera y */
    if(mouseDownAnchorY >= 0){
        if(Math.abs(my - mouseDownAnchorY) > 150 && !moveMouseY){
            cameraY += my - mouseDownAnchorY;
            moveMouseY = true;
        }
        if(moveMouseY)
            cameraY += my - myPrev;
    }

    /* clamp stuff */
    if(userScaleY < -.25)
        userScaleY = -.25;

    candleWidth = clamp(candleWidth, minCandleWidth, maxCandleWidth);

    candleSpacing = candleWidth + (candleWidth / 2);

    if(md){
        canvas.style.cursor = "grab";
        scrollVelocity = (mx - mxPrev) / candleSpacing;
        cameraX -= scrollVelocity;

    }
    if(!md)
        cameraX -= scrollVelocity;

    scrollVelocity *= .98;

    if(cameraX < 0)
        cameraX = 0;

    startingCandle = Math.floor(cameraX);
    endingCandle = (canvas.width / candleSpacing) + cameraX + 1;

    /* allow users to scroll through chart on keyboard */
    if(mx > canvas.width){
        cameraX += 1;
        mx = canvas.width;
    }
    if(mx < 0){
        cameraX -= 1;
        mx = 0;
    }

    /* update button pos smoothly */
    if(mx >= plusButton.x && mx <= expandButton.x + expandButton.w
    && my >= plusButton.y && my <= plusButton.y + plusButton.h ){
        buttonAlpha = 1;
        minusButton.w = lerp(minusButton.w, largeButtonWidth, .2);
        minusButton.h = lerp(minusButton.h, largeButtonHeight, .2);
        plusButton.w = lerp(plusButton.w, largeButtonWidth, .2);
        plusButton.h = lerp(plusButton.h, largeButtonHeight, .2);
    }
    else{
        buttonAlpha = .8
        minusButton.w = lerp(minusButton.w, smallButtonWidth, .2);
        minusButton.h = lerp(minusButton.h, smallButtonHeight, .2);
        plusButton.w = lerp(plusButton.w, smallButtonWidth, .2);
        plusButton.h = lerp(plusButton.h, smallButtonHeight, .2);
    }

    if(leftButton.mouseOver(mx, my) && md)
        cameraX -= (canvas.width / candleSpacing) * .005;

    if(rightButton.mouseOver(mx, my) && md)
        cameraX += (canvas.width / candleSpacing) * .005;

    /* scroll if new data && last candle is on on screen */
    if(candleArray.length < endingCandle
    && candleArrayOldLength < candleArray.length)
        cameraX++;

    /* clamping */
    if(endingCandle > candleArray.length)
        endingCandle = candleArray.length;

    if(cameraX > candleArray.length - 1)
        cameraX = candleArray.length - 1;

    startingCandle = Math.floor(cameraX);
}

let _render = function(){
    /* cull candles out of view */
    let visibleCandles = candleArray.slice(startingCandle, endingCandle);
    let visibleCandlesLow = findLowHigh(visibleCandles)[0];
    let visibleCandlesHigh = findLowHigh(visibleCandles)[1];

    /* Render background */
    ctx.fillStyle = chartBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = chartLineColour;
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 1;

    for(let i = 0; i < canvas.width; i += 30){
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for(let i = 0; i < canvas.height; i += 30){
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    /* last price line */
    let margin = canvas.height * 0.05; // 5% margin
    let bottomMargin = canvas.height - margin;
    let scaleY = (canvas.height - (margin * 2)) / ((visibleCandlesHigh - visibleCandlesLow) + userScaleY);
    let lastPrice = candleArray[candleArray.length-1];
    let lastPriceY = bottomMargin - (((lastPrice.close - visibleCandlesLow) * scaleY)) + cameraY;
    ctx.strokeStyle = lastPrice.close >= lastPrice.open ? candleGreen : candleRed;

    /* check for doji last price */
    if(lastPrice.close == lastPrice.open)
        ctx.strokeStyle = wickColour;

    ctx.beginPath();
    ctx.moveTo(0, lastPriceY);
    ctx.lineTo(canvas.width, lastPriceY);
    ctx.stroke();

    let ohlcColour = "";

    for(let i = 0; i < visibleCandles.length; i++){
        let xPos = (i * candleSpacing) - ((cameraX - startingCandle) * candleSpacing) + candleWidth/4;
        visibleCandles[i].render(xPos, visibleCandlesLow, visibleCandlesHigh);

        let candleX = (i * candleSpacing) - ((cameraX - startingCandle) * candleSpacing);
        if(mx > candleX && mx <= (candleX + candleSpacing) || (i == visibleCandles.length)){
            o = visibleCandles[i].open;
            h = visibleCandles[i].high;
            l = visibleCandles[i].low;
            c = visibleCandles[i].close;

            /* doji colour */
            if(visibleCandles[i].open == visibleCandles[i].close)
                ohlcColour = uiGrey;
            else
                ohlcColour = visibleCandles[i].close >= visibleCandles[i].open ? uiGreen : uiRed;

            /* mouse x line */
            let lineX = candleX + (candleWidth/4) + (candleWidth/2);
            ctx.strokeStyle = "#ffff";
            ctx.beginPath();
            ctx.moveTo(lineX, 0);
            ctx.lineTo(lineX, canvas.height);
            ctx.stroke();
        }
    }

    /* render ui here */

    /* mouse y line */
    ctx.strokeStyle = "#ffff";
    ctx.beginPath();
    ctx.moveTo(0, my + .5); // sharpen trick by adding + 0.5
    ctx.lineTo(canvas.width, my + .5);
    ctx.stroke();

    /* render y scrubber text */
    let valueAtMouse = visibleCandlesLow + (((bottomMargin - my) + userScaleY) / scaleY);
    let yScrubberLabel = valueAtMouse.toFixed(2);

    ctx.font = "16px Arial";
    textWidth = ctx.measureText(yScrubberLabel).width;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(canvas.width - textWidth - 10, my, textWidth + 10, 25, [0, 0, 0, 10]);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.fillText(yScrubberLabel, canvas.width - textWidth - 5, my + 17);

    /* render ohlc on canvas */
    if(o != undefined){
        let ohlcString = `O: ${o.toFixed(2)} H: ${h.toFixed(2)} L: ${l.toFixed(2)} C: ${c.toFixed(2)}`;

        ctx.font = "16px Arial";
        textWidth = ctx.measureText(ohlcString).width;
        let oStrLen = ctx.measureText(o.toFixed(2) + "").width;
        let hStrLen = ctx.measureText(h.toFixed(2) + "").width;
        let lStrLen = ctx.measureText(l.toFixed(2) + "").width;
        //let cStrLen = ctx.measureText(c.toFixed(2) + "").width;

        let textCursor = 25;

        ctx.fillStyle = "rgba(25, 25, 25, .6)";
        ctx.beginPath();
        ctx.roundRect(20, 32, textWidth + 10, 25, 5);
        ctx.fill();

        ctx.fillStyle = uiGrey;
        ctx.fillText("O: ", textCursor, 50);
        textCursor += ctx.measureText("O: ").width;

        ctx.fillStyle = ohlcColour;
        ctx.fillText(o.toFixed(2), textCursor, 50);
        textCursor += oStrLen;

        ctx.fillStyle = uiGrey;
        ctx.fillText(" H: ", textCursor, 50);
        textCursor += ctx.measureText(" H: ").width;

        ctx.fillStyle = ohlcColour;
        ctx.fillText(h.toFixed(2), textCursor, 50);
        textCursor += hStrLen;

        ctx.fillStyle = uiGrey;
        ctx.fillText(" C: ", textCursor, 50);
        textCursor += ctx.measureText(" C: ").width;

        ctx.fillStyle = ohlcColour;
        ctx.fillText(c.toFixed(2), textCursor, 50);
        textCursor += lStrLen;

        ctx.fillStyle = uiGrey;
        ctx.fillText(" L: ", textCursor, 50);
        textCursor += ctx.measureText(" L: ").width;

        ctx.fillStyle = ohlcColour;
        ctx.fillText(l.toFixed(2), textCursor, 50);
    }

    /* center buttons */
    let buttonOffsets = canvas.width/2 - (plusButton.w + minusButton.w + leftButton.w + rightButton.w + expandButton.w + (20 * 3))/2;

    plusButton.y = canvas.height - plusButton.h - 20;
    plusButton.x = buttonOffsets + 1;

    minusButton.y = canvas.height - plusButton.h - 20;
    minusButton.x = buttonOffsets + plusButton.w;

    leftButton.x = minusButton.x + minusButton.w + 11;
    leftButton.y = minusButton.y;
    leftButton.h = minusButton.h;
    leftButton.w = minusButton.w;

    rightButton.x = leftButton.x + leftButton.w;
    rightButton.y = leftButton.y;
    rightButton.h = leftButton.h;
    rightButton.w = leftButton.w;

    resetButton.x = rightButton.x + rightButton.w + 10;
    resetButton.y = rightButton.y;
    resetButton.h = rightButton.h;
    resetButton.w = rightButton.w;

    expandButton.x = resetButton.x + resetButton.w + 10;
    expandButton.y = resetButton.y;
    expandButton.w = resetButton.w;
    expandButton.h = resetButton.h;

    /* render buttons */
    ctx.fillStyle = "rgba(255, 255, 255, " + buttonAlpha + ')'; 

    plusButton.render([3, 0, 0, 3]);

    ctx.fillStyle = "rgba(255, 255, 255, " + buttonAlpha + ')';

    minusButton.render([0, 3, 3, 0]);

    ctx.fillStyle = "#000000";
    ctx.fillRect(buttonOffsets + plusButton.w, plusButton.y, 1, plusButton.h);

    ctx.fillStyle = "rgba(255, 255, 255, " + buttonAlpha + ')';
    leftButton.render([3, 0, 0, 3]);
    ctx.fillStyle = "rgba(255, 255, 255, " + buttonAlpha + ')';
    rightButton.render([0, 3, 3, 0]);

    ctx.fillStyle = "#000000";
    ctx.fillRect(leftButton.x + leftButton.w, leftButton.y, 1, plusButton.h);

    ctx.fillStyle = "rgba(255, 255, 255, " + buttonAlpha + ')';
    resetButton.render([3, 3, 3, 3]);
    
    ctx.fillStyle = "rgba(255, 255, 255, " + buttonAlpha + ')';
    expandButton.render([3, 3, 3, 3]);

    if(minusButton.mouseOver(mx, my) || plusButton.mouseOver(mx, my)
    || leftButton.mouseOver(mx, my) || rightButton.mouseOver(mx, my)
    || resetButton.mouseOver(mx, my) || expandButton.mouseOver(mx, my))
        canvas.style.cursor = "pointer";
}

let loop = setInterval(() => {
    const container = document.getElementById("asset_container").getBoundingClientRect();
    canvas.width = container.width;
    canvas.height = container.height

    _input();
    _update();
    _render();

    /* mx and my delta used for scrubbing */
    mxPrev = mx;
    myPrev = my;
    mu = false;
    kd = false;
    wheelDeltaY = 0;
    candleArrayOldLength = candleArray.length;
}, msps);

/* input handlers */
addEventListener("mousemove", function(event) {
    const rect = canvas.getBoundingClientRect();
    mx = event.clientX - rect.left;
    my = event.clientY - rect.top;
});

addEventListener("mousedown", (event) => {
    md = true;
    mouseDownAnchorY = my;
})

addEventListener("mouseup", (event) => {
    md = false;
    mu = true;
})

canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    wheelDeltaY = event.deltaY;
});

window.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;
    kd = true;
});

window.addEventListener("keyup", (event) => {
    keysPressed[event.key] = false;
});