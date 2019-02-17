const width = 600, height = 600;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var testT = triangle();

testT.p[0].x = 20;
testT.p[0].y = 30;
testT.p[0].z = 15;

var vec3d = {
    x, 
    y, 
    z
}

var triangle = {
    p = new vec3d[3]
}

function OLDdrawPoint(x, y){
    ctx.moveTo(x,y);
    ctx.lineTo(x + 1, y +1);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.stroke();
}

function drawPoint(x,y, color){
    ctx.strokeRect(x,y,1,1);
    ctx.strokeStyle = color;
}


function render(){
    ctx.clearRect(0,0, width, height);

    //OLDdrawPoint(20, 50);
    drawPoint(20,50, "white");

    //repeat the drawing
    requestAnimationFrame(render);
}

// Start the drawing
render();
