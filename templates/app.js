var socket = io.connect('http://localhost:5000');
socket.on('after connect', function(msg) {
  console.log('After connect', msg);
});
var canvas = document.getElementById("draw");

var ctx = canvas.getContext("2d");
resize();

var points = [];

// resize canvas when window is resized
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

// initialize position as 0,0
var pos = { x: 0, y: 0 };
var prev_x = 0;
var prev_y = 0;
var count = 0;

function clear(e) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  points = [];
}

// new position from mouse events
function setPosition(e) {
  pos.x = e.clientX;
  pos.y = e.clientY;
}
function setPosition_end(e) {
  pos.x = e.clientX;
  pos.y = e.clientY;
  point =[prev_x,prev_y,0,0,1];
  points.push(point);
  console.log(point);
  console.log(points)
  socket.emit('end',points);
}


function SketchToPoint(pos, prev_x,prev_y,p1,p2,p3){
  del_x = prev_x - pos.x;
  del_y = prev_y - pos.y;
  return [del_x,del_y,p1,p2,p3];
}

function setPosition_up(e) {
  pos.x = e.clientX;
  pos.y = e.clientY;
  point = SketchToPoint(pos,prev_x,prev_y,0,1,0);
  points.push(point)
  console.log(point);
}

function draw(e) {
  if (e.buttons !== 1) return; // if mouse is not clicked, do not go further

  var color = document.getElementById("color").value;
  
  ctx.beginPath(); // begin the drawing path

  ctx.lineWidth = 10; // width of line
  ctx.lineCap = "round"; // rounded end cap
  ctx.strokeStyle = color; // hex color of line
  //console.log(pos);
  ctx.moveTo(pos.x, pos.y); // from position
  
  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
   // to position
  //console.log(pos);
 
  
  point = SketchToPoint(pos, prev_x, prev_y,1,0,0);
  points.push(point)
  
  ctx.stroke(); // draw it!
  prev_x = pos.x;
  prev_y = pos.y;

  console.log(point);
  count = count + 1;
}


// add window event listener to trigger when window is resized
window.addEventListener("resize", resize);

// add event listeners to trigger on different mouse events
document.addEventListener("mousemove", draw);
document.addEventListener("mousedown", setPosition);
document.addEventListener("mouseenter", setPosition);
document.addEventListener('mouseup',setPosition_up);
document.getElementById("end").addEventListener('mousedown',setPosition_end);
document.getElementById('clear').addEventListener('click',clear)