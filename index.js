// parse location
let GET = {};
for(const item of window.location.search.split(/&|\?/).filter(substr => substr)){
    let [key, val] = item.split('=').map(decodeURIComponent);
    GET[key] = val;
}

let els = {
    'sides': document.querySelector('#sides'),
    'delta_theta': document.querySelector('#delta-theta'),
    'stroke_weight': document.querySelector('#stroke-weight'),
    'max_length': document.querySelector('#max-length'),
    'checkboxes': {
        'slider': document.querySelector('#slider-checkbox'),
        'color_anim': document.querySelector('#color-anim'),
    },
    'color_offset': document.querySelector('#color-offset'),
    'share_link': document.querySelector('#share-link'),
};

function setup(){
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    colorMode(HSL);
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
    els.checkboxes.slider.addEventListener('change', ()=>{
        let type = "number";
        if(els.checkboxes.slider.checked)
            type = 'range';
        els.delta_theta.type = type;
        els.stroke_weight.type = type;
        els.max_length.type = type;
        els.color_offset.type = type;
    });
    els.checkboxes.color_anim.addEventListener('change', ()=>{
        if(els.checkboxes.color_anim.checked){
            loop();
        } else {
            noLoop();
        }
    });
    els.color_offset.addEventListener('input', redraw);
    noLoop();
    load_from_get();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    update_share_link();
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
    if(els.checkboxes.color_anim.checked){
        let val = parseFloat(els.color_offset.value);
        els.color_offset.value = (val + 1) % 360;
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
    let offset = parseFloat(els.color_offset.value);
    return color(
        (current / max * 360 + offset) % 360,
        100,
        50,
    );
}

function reset_some(){
    els.delta_theta.value = 360 / parseFloat(els.sides.value) - 0.1;
}

function reset_all(){
    els.sides.value = 6;
    reset_some();
    els.max_length.value = 3000;
    els.stroke_weight.value = 1;
    strokeWeight(els.stroke_weight.value);
    els.color_offset.value = 0;
    window.location.search = "";
    redraw();
}

function load_from_get(){
    els.sides.value = GET.sides ?? 6;
    els.delta_theta.value = GET.deltaTheta ?? 360 / parseFloat(els.sides.value) - 0.1;
    els.max_length.value = GET.maxLen ?? 3000;
    els.stroke_weight.value = GET.strokeWeight ?? 1;
    strokeWeight(els.stroke_weight.value);
    els.color_offset.value = GET.colorOffset ?? 0;
    if(GET?.colorAnim === 'true' && !els.checkboxes.color_anim.checked)
        els.checkboxes.color_anim.click();
}

function make_share_link(){
    let url = location.href.split(/\?/)[0];
    return `${url}?sides=${els.sides.value}&deltaTheta=${els.delta_theta.value}&maxLen=${els.max_length.value}&strokeWeight=${els.stroke_weight.value}&colorOffset=${els.color_offset.value}&colorAnim=${els.checkboxes.color_anim.checked.toString()}`
}

function update_share_link(){
    els.share_link.href = make_share_link();
}
