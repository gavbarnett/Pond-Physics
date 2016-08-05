var squids = [];
var msgs = [];
var fpstime = new Date;
var A_temp_Global = [Math.random()*700,Math.random()*700];
function startGame() {
    for (i = 0; i < 50; i++) {
    squids[i] = new squid(5, 'red', Math.random()*700, Math.random()*700, Math.random()*50, Math.random()*50, 30+Math.random()*20, Math.random()*50, Math.random()*25);
    }
    msgs[0] = new msg('0', 20, 30);
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

function squid(size, shcolor, x, y, finlength, angles, rates, cangle, offset) {
    this.size = size;
    this.x = [x,0,0,0];
    this.y = [y,0,0,0];
    this.vx = 0;
    this.vy = 0;
    this.shcolor = shcolor;
    this.offset = [offset, offset*Math.random()*3,offset*Math.random()*3];
    this.finlength = [finlength, finlength*Math.random(), finlength*Math.random()];
    this.rate = [rates, Math.random()*2*rates, Math.random()*3*rates];
    this.angle = [angles+this.offset[0], angles*Math.random()*2+this.offset[1], angles*Math.random()*3+this.offset[2]];
    this.cangle = [cangle, cangle, cangle];
    this.update = function(){
        ctx = myGameArea.context;
        //draw head
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.arc(this.x[0], this.y[0], this.size, 0, 2*Math.PI, false);
        ctx.fillStyle = this.shcolor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        //draw tail
        var x_temp = this.x[0];
        var y_temp = this.y[0];
        var vxnew = 0;
        var vynew = 0;
        var tanx = (A_temp_Global[0]-this.x[0]);
        var tany = (A_temp_Global[1]-this.y[0]);
        var A_temp = (180/Math.PI)*Math.atan(tanx/tany);
        if (tany>0){
          A_temp-=180;
        }
        if (Math.pow(Math.pow(tanx,2)+Math.pow(tany,2),0.5)<5){
          for (i = 0; i < 50; i++) {
          squids[i] = new squid(5, 'red', Math.random()*700, Math.random()*700, this.finlength[0]*(0.9+0.2*Math.random()),this.angle[0]*(0.9+0.2*Math.random()),this.rate[0]*(0.9+0.2*Math.random()),0,this.offset[0]*(0.9+0.2*Math.random()));
          }
          A_temp_Global = [Math.random()*700,Math.random()*700];
        }

        for (i = 0; i < 3; i++) {
          //A_temp = this.angle[i]+A_temp;
          this.cangle[i] = this.cangle[i]+ ((this.angle[i]-this.cangle[i])/this.rate[i]);
          if ((this.cangle[i])/this.angle[i] > 0.95) { //if closer than 95% then
            this.angle[i] = -1 * (this.angle[i]-this.offset[i])+this.offset[i];
            if (this.angle[i]<1){
              this.rate[i] *=0.2
            } else {
              this.rate[i] *=(1/0.2)
            }
          //  this.rate[i] = -1 * this.rate[i];
          }
          msgs[i].text = this.angle[i] + '  ' + this.cangle[i];
          ctx.beginPath();
          ctx.moveTo(x_temp, y_temp);
          x_temp += this.finlength[i]*Math.sin((this.cangle[i]+A_temp)/180*Math.PI);
          y_temp += this.finlength[i]*Math.cos((this.cangle[i]+A_temp)/180*Math.PI);
          if (this.x[i+1] != 0){
            vxnew += Math.pow(this.x[i+1]-x_temp,3)*this.finlength[i]/1000;
            vynew += Math.pow(this.y[i+1]-y_temp,3)*this.finlength[i]/1000;
          }
          this.x[i+1]=x_temp;
          this.y[i+1]=y_temp;
          A_temp = this.cangle[i] + A_temp;
          ctx.lineWidth=3-i;
          ctx.lineTo(x_temp, y_temp);
          ctx.stroke();
          //this.x = this.x-1;
       }
       var drag = 60;
       vxnew = Math.min(vxnew,2);
       vxnew = Math.max(vxnew,-2);
       this.vx = (vxnew*1+this.vx*drag)/(drag+1);
       this.x[0] += this.vx;
       vynew = Math.min(vynew,2);
       vynew = Math.max(vynew,-2);
       this.vy = (vynew*1+this.vy*drag)/(drag+1);
       this.y[0] += this.vy;
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
    var fpstime2 = new Date;
    //msgs[0].text = Math.round((msgs[0].text*4 + 1000/(fpstime2 - fpstime))/5);
    fpstime = fpstime2;
    myGameArea.clear();
    ctx = myGameArea.context;
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.arc(A_temp_Global[0], A_temp_Global[1], 10, 0, 2*Math.PI, false);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    for (j = 0; j < 50; j++) {
      squids[j].update();
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
