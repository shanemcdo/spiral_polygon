let els = {
    'sides': document.querySelector('#sides'),
    'delta_theta': document.querySelector('#delta-theta'),
    'stroke_weight': document.querySelector('#stroke-weight'),
    'max_length': document.querySelector('#max-length'),
    'checkboxes': {
        'slider': document.querySelector('#slider-checkbox'),
    },
};
let delta_theta = 360 / els.sides.value - 1;

function setup(){
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    els.sides.addEventListener('input', ()=>{
        let val = parseFloat(els.sides.value);
        if(val < els.sides.min)
            els.sides.value = els.sides.min;
        reset_some();
        redraw();
    });
    els.delta_theta.addEventListener('input', redraw);
    els.stroke_weight.addEventListener('input', ()=>{
        let val = parseFloat(els.stroke_weight.value);
        if(val < els.stroke_weight.min)
            els.stroke_weight.value = els.stroke_weight.min;
        strokeWeight(els.stroke_weight.value);
        redraw();
    });
    els.max_length.addEventListener('input', redraw);
    els.checkboxes.slider.addEventListener('input', ()=>{
        let type = "number";
        if(els.checkboxes.slider.checked)
            type = 'range';
        els.delta_theta.type = type;
        els.stroke_weight.type = type;
        els.max_length.type = type;
    });
    reset_all();
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
    let sides = parseFloat(els.sides.value);
    let max_size = parseFloat(els.max_length.value);
    let delta_theta = parseFloat(els.delta_theta.value);
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

function reset_some(){
    els.delta_theta.value = 360 / parseFloat(els.sides.value) - 1;
}

function reset_all(){
    reset_some();
    els.max_length.value = 2000
    els.stroke_weight.value = 1;
    strokeWeight(1);
    redraw();
}
