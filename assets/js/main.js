var squids = [];
var msgs = [];

function startGame() {
    squids[0] = new squid(5, 'red', 700/2, 700/2, 50, 25, 20,10);
    squids[1] = new squid(5, 'green', 700/4, 700/2.4, 30, 10, 50,0);
    squids[2] = new squid(5, 'yellow', 700/1.5, 700/1.5, 40, 30, 50,7);
    msgs[0] = new msg('hello world', 20, 30);
    msgs[1] = new msg('hello world', 20, 50);
    msgs[2] = new msg('hello world', 20, 70);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 700;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function squid(size, shcolor, x, y, finlength, angles, rates, cangle) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.shcolor = shcolor;
    this.finlength = [finlength, finlength*0.7, finlength*0.3];
    this.angle = [angles, angles*0.7, angles*0.5];
    this.cangle = [cangle, cangle, cangle];
    this.rate = [rates, rates*0.7, rates*0.3];
    this.update = function(){
        ctx = myGameArea.context;
        //draw head
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI, false);
        ctx.fillStyle = this.shcolor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        //draw tail
        var x_temp = this.x;
        var y_temp = this.y;
        var A_temp = 90;
        for (i = 0; i < 3; i++) {
          //A_temp = this.angle[i]+A_temp;
          this.cangle[i] = this.cangle[i]+ (this.angle[i])/this.rate[i];
          if (Math.abs((this.cangle[i])/this.angle[i]) > 0.95) { //if closer than 95% then
            this.angle[i] = -1 * this.angle[i];
          }
          msgs[i].text = this.cangle[i];
          ctx.beginPath();
          ctx.moveTo(x_temp, y_temp);
          x_temp += this.finlength[i]*Math.sin((this.cangle[i]+A_temp)/180*Math.PI);
          y_temp += this.finlength[i]*Math.cos((this.cangle[i]+A_temp)/180*Math.PI);
          A_temp = this.cangle[i] + A_temp;
          ctx.lineWidth=3-i;
          ctx.lineTo(x_temp, y_temp);
          ctx.stroke();
       }
        //finish
    }
}

function msg(text, x, y){
  this.text = text;
  this.color = 'white';
  this.x = x;
  this.y = y;
  this.update = function(){
    ctx = myGameArea.context;
    ctx.font = "16px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "left";
    ctx.fillText(this.text,this.x, this.y);//this.text, this.x, this.y);
  }
}

function updateGameArea() {
    myGameArea.clear();
    for (j = 0; j < 3; j++) {
      squids[j].update();
      msgs[j].update();
    }
}


function colorshaker(color){
  /*taked in a color and randomly adjusts it*/
  var p1 = parseInt(color.substring(1,3),16);
  var p2 = parseInt(color.substring(3,5),16);
  var p3 = parseInt(color.substring(5,7),16);
  p1 = p1+(-20+Math.round(40*Math.random()));
  p2 = p2+(-20+Math.round(40*Math.random()));
  p3 = p3+(-20+Math.round(40*Math.random()));
  if (p1 > 255){
    p1 = 255;
  } else if (p1 < 0){
    p1 = 0;
  }
  if (p2 > 255){
    p2 = 255;
  } else if (p2 < 0){
    p2 = 0;
  }
  if (p3 > 255){
    p3 = 255;
  } else if (p3 < 0){
    p3 = 0;
  }
  p1 = p1.toString(16);
  p2 = p2.toString(16);
  p3 = p3.toString(16);
  while (p1.length < 2) {
        p1 = "0" + p1;
    }
    while (p2.length < 2) {
          p2 = "0" + p2;
      }
      while (p3.length < 2) {
            p3 = "0" + p3;
        }
  color = '#'+p1+p2+p3;
  return color;
}
