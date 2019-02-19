const width = 600, height = 600; fFov = 70.0
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var lastLoop = new Date();
let fps = 1;
let fTheta = 1;
var continueKey = false;

class vec3d {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getZ(){
        return this.z;
    }

    getVec(){
        return new vec3d(this.x, this.y, this.z);
    }
}

class triangle{
    constructor(p0, p1, p2){
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }
}

function mat4x4() {
    var matrix = new Array(4);

    for(i = 0; i < 4; i++){
        matrix[i] = new Array(4);

        for(j = 0; j < 4; j++){
            matrix[i][j] = 0;
        }
    }

    return matrix;
}

function multiplyMatrixVector(i, m){

    let o = new vec3d(0,0,0);

    o.x     = i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + m[3][0];
    o.y     = i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + m[3][1];
    o.z     = i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + m[3][2];
    var w   = i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + m[3][3];

    if(w != 0){
        o.x = o.x / w ;
        o.y = o.y / w;
        o.z = o.z / w;
    }

    return o;
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
        new triangle( new vec3d(1.0, 0.0, 1.0),    new vec3d(0.0, 0.0, 0.0),    new vec3d(1.0, 0.0, 0.0) ),
    ]
}

var projectionMat = {
    m : mat4x4(),
}

function initiateMat(){

    var fNear = 0.1;
    var fFar = 1000;
    var fFov = 90;
    var fAspectRatio = height / width;
    var fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180.0 * 3.14159);

    projectionMat.m[0][0] = fAspectRatio * fFovRad;
    projectionMat.m[1][1] = fFovRad;
    projectionMat.m[2][2] = fFar / (fFar - fNear);
    projectionMat.m[3][2] = (-fFar * fNear) / (fFar - fNear);
    projectionMat.m[2][3] = 1.0;
    projectionMat.m[3][3] = 0.0;
}

function drawPoint(x,y, color){
    ctx.strokeRect(x,y,1,1);
    ctx.strokeStyle = color;
}

function drawTriangle(tri){
    ctx.beginPath();
    ctx.moveTo(tri.p0.x, tri.p0.y);
    ctx.lineTo(tri.p1.x, tri.p1.y);
    ctx.lineTo(tri.p2.x, tri.p2.y);
    ctx.fillStyle = "white";
    ctx.fill();
}

function drawTriangleStroke(tri, color){
    ctx.beginPath();
    ctx.moveTo(tri.p0.x, tri.p0.y);
    ctx.lineTo(tri.p2.x, tri.p2.y);
    ctx.lineTo(tri.p1.x, tri.p1.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.stroke();
}

function render(){
    // Clear screen before drawing new frame
    const now = performance.now();
    ctx.clearRect(0,0, width, height);

    var mRotZ = mat4x4(), mRotX = mat4x4();
    
    fTheta += 1*(1/fps);

    console.log(fTheta);

    // Rotation Z
    mRotZ[0][0] = Math.cos(fTheta);
    mRotZ[0][1] = Math.sin(fTheta);
    mRotZ[1][0] = -Math.sin(fTheta);
    mRotZ[1][1] = Math.cos(fTheta);
    mRotZ[2][2] = 1;
    mRotZ[3][3] = 1;

    // Rotation X
    mRotX[0][0] = 1;
    mRotX[1][1] = Math.cos(fTheta * 0.5);
    mRotX[1][2] = Math.sin(fTheta * 0.5);
    mRotX[2][1] = -Math.sin(fTheta * 0.5);
    mRotX[2][2] = Math.cos(fTheta * 0.5);
    mRotX[3][3] = 1;


    for (var tris of cube.mesh) {
        var triProjected = new triangle(new vec3d(0, 0, 0), new vec3d(0, 0, 0), new vec3d(0, 0, 0));
        var triRotatedZ = new triangle(new vec3d(0, 0, 0), new vec3d(0, 0, 0), new vec3d(0, 0, 0));
        var triRotatedZX = new triangle(new vec3d(0, 0, 0), new vec3d(0, 0, 0), new vec3d(0, 0, 0));


        // Rotated on Z-axis
        triRotatedZ.p0 = multiplyMatrixVector(tris.p0, mRotZ);
        triRotatedZ.p1 = multiplyMatrixVector(tris.p1, mRotZ);
        triRotatedZ.p2 = multiplyMatrixVector(tris.p2, mRotZ);

        // Rotated on X-axis
        triRotatedZX.p0 = multiplyMatrixVector(triRotatedZ.p0, mRotX);
        triRotatedZX.p1 = multiplyMatrixVector(triRotatedZ.p1, mRotX);
        triRotatedZX.p2 = multiplyMatrixVector(triRotatedZ.p2, mRotX);

        // Translate the triangle
        let triTranslated = new triangle(triRotatedZX.p0.getVec(), triRotatedZX.p1.getVec(), triRotatedZX.p2.getVec());
        triTranslated.p0.z = triRotatedZX.p0.z + 5.0;
        triTranslated.p1.z = triRotatedZX.p1.z + 5.0;
        triTranslated.p2.z = triRotatedZX.p2.z + 5.0;    

        // Project triangle on perspective
        triProjected.p0 = multiplyMatrixVector(triTranslated.p0, projectionMat.m);
        triProjected.p1 = multiplyMatrixVector(triTranslated.p1, projectionMat.m);
        triProjected.p2 = multiplyMatrixVector(triTranslated.p2, projectionMat.m);

        // Scale into view
        triProjected.p0.x += 1; triProjected.p0.y += 1;
        triProjected.p1.x += 1; triProjected.p1.y += 1;
        triProjected.p2.x += 1; triProjected.p2.y += 1;

        triProjected.p0.x *= 0.5 * width; triProjected.p0.y *= 0.5 * height;
        triProjected.p1.x *= 0.5 * width; triProjected.p1.y *= 0.5 * height;
        triProjected.p2.x *= 0.5 * width; triProjected.p2.y *= 0.5 * height;

        // Draw the wireframe of the triangle
        console.log(triProjected);
        drawTriangle(triProjected);

    }
    
    // Calculate difference to get FPS
    var thisLoop = new Date();
    fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
    document.title = "FPS: " + fps;

    //repeat the drawing
    requestAnimationFrame(render);
}

// Start the drawing
initiateMat();
render();