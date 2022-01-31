let els = {
    'sides': document.querySelector("#sides"),
    'delta_theta': document.querySelector("#delta-theta"),
};
let delta_theta = 360 / els.sides.value - 1;

function setup(){
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    els.sides.addEventListener('input', ()=>{
        reset();
        redraw();
    });
    els.delta_theta.addEventListener('input', redraw);
    reset();
    noLoop();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    background(0);
    translate(windowWidth / 2, windowHeight / 2);
    let pos = createVector();
    let angle = 0;
    let sides = parseInt(els.sides.value);
    let max_size = Math.max(windowWidth, windowHeight) * 2;
    let delta_theta = parseInt(els.delta_theta.value);
    for(let i = 0; i < max_size; i++){
        stroke(calculate_rainbow(i % sides, sides));
        pos = draw_line_at_angle(pos, angle, i);
        angle += delta_theta;
        angle %= 360;
    }
}

function draw_line_at_angle(start, angle, length) {
    let end = createVector(
        start.x + cos(angle) * length,
        start.y + sin(angle) * length,
    );
    line(start.x, start.y, end.x, end.y);
    return end
}

function calculate_rainbow(current, max) {
    push();
    colorMode(HSL);
    let c = color(
        current / max * 360,
        100,
        50,
    );
    pop();
    return c;
}

function reset(){
    els.delta_theta.value = 360 / parseInt(els.sides.value) - 1;
}
