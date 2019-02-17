const width = 600, height = 600;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

class vec3d {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class triangle{
    constructor(p0, p1, p2){
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }
}

var cube = {
   mesh : [
        // SOUTH
        new triangle( new vec3d(0.0, 0.0, 0.0),    new vec3d(0.0, 1.0, 0.0),    new vec3d(1.0, 1.0, 0.0) ),
        new triangle( new vec3d(0.0, 0.0, 0.0),    new vec3d(1.0, 1.0, 0.0),    new vec3d(1.0, 0.0, 0.0) ),

        // EAST
        new triangle( new vec3d(1.0, 0.0, 0.0),    new vec3d(1.0, 1.0, 0.0),    new vec3d(1.0, 1.0, 1.0) ),
        new triangle( new vec3d(1.0, 0.0, 0.0),    new vec3d(1.0, 1.0, 1.0),    new vec3d(1.0, 0.0, 1.0) ),

        // NORTH
        new triangle( new vec3d(1.0, 0.0, 1.0),    new vec3d(1.0, 1.0, 1.0),    new vec3d(0.0, 1.0, 1.0) ),
        new triangle( new vec3d(1.0, 0.0, 1.0),    new vec3d(0.0, 1.0, 1.0),    new vec3d(0.0, 0.0, 1.0) ),

        // WEST
        new triangle( new vec3d(0.0, 0.0, 1.0),    new vec3d(0.0, 1.0, 1.0),    new vec3d(0.0, 1.0, 0.0) ),
        new triangle( new vec3d(0.0, 0.0, 1.0),    new vec3d(0.0, 1.0, 0.0),    new vec3d(0.0, 0.0, 0.0) ),

        // TOP
        new triangle( new vec3d(0.0, 1.0, 0.0),    new vec3d(0.0, 1.0, 1.0),    new vec3d(1.0, 1.0, 1.0) ),
        new triangle( new vec3d(0.0, 1.0, 0.0),    new vec3d(1.0, 1.0, 1.0),    new vec3d(1.0, 1.0, 0.0) ),

        // BOTTOM
        new triangle( new vec3d(1.0, 0.0, 1.0),    new vec3d(0.0, 0.0, 1.0),    new vec3d(0.0, 0.0, 0.0) ),
        new triangle( new vec3d(1.0, 0.0, 1.0),    new vec3d(0.0, 0.0, 0.0),    new vec3d(1.0, 0.0, 0.0) )
    ]
}

var projectionMat = {
    fNear : 0.1,
    fFar : 1000.0,
    fFov : 90.0,
    fAspectRatio : width/height,
    fFovRad : 1 / Math.tan(fFov * 0.5 / 180.0 * 3.14159)

}

console.log(projectionMat.fFovRad);

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
