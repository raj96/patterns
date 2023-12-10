document.addEventListener('DOMContentLoaded', InitializeApp);

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const biggerDim = screenHeight > screenWidth ? screenHeight : screenWidth;
const smallerDim = screenHeight < screenWidth ? screenHeight : screenWidth;

const AppState = {
    n: 0,
    d: 0,
    hiResDim: 2560,
    hiResP5Sketch: null,
};

function _(z) {
    return document.getElementById(z);
}

function setup() {

    AppState.canvasDim = Math.ceil(smallerDim / 1.05);
    let canvasWidth = AppState.canvasDim;
    let canvasHeight = AppState.canvasDim;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent("canvas-container");

    background(0);

}

function getCartesianPoint(n, theta, scaler) {
    theta *= (Math.PI / 180);
    let r = Math.sin(n * theta);

    let x = r * Math.sin(theta);
    let y = r * Math.cos(theta);

    x = map(x, 1, -1, 0, scaler);
    y = map(y, 1, -1, 0, scaler);

    return { x, y };
}

function draw() {

    if (AppState.n == 0 || AppState.d == 0) {
        noLoop();
        return;
    }

    background(0);

    let previousPoint = getCartesianPoint(AppState.n, 0, AppState.canvasDim);
    let previousOutlinePoint = getCartesianPoint(AppState.n, 0, AppState.canvasDim);

    for (let i = 1; i < 361; i++) {
        let p = getCartesianPoint(AppState.n, AppState.d * i, AppState.canvasDim);

        let op = getCartesianPoint(AppState.n, i, AppState.canvasDim);

        stroke("lime");
        strokeWeight(0.5);
        line(previousPoint.x, previousPoint.y, p.x, p.y);
        stroke("red");
        strokeWeight(3);
        line(previousOutlinePoint.x, previousOutlinePoint.y, op.x, op.y);
        previousPoint = p;
        previousOutlinePoint = op;
    }

    noLoop();
}

function AttachListenersToInputs() {
    const nEl = _("n");
    const dEl = _("d");
    const downloadEl = _("download");

    nEl.onkeyup = (ev) => {
        const value = Number(ev.target.value);
        console.log(value)
        if (isNaN(value)) {
            value = 0;
            alert("n should be a number");
        }

        AppState.n = value;
        redraw();
    };
    nEl.onblur = nEl.onchange;

    dEl.onkeyup = (ev) => {
        const value = Number(ev.target.value);
        if (isNaN(value)) {
            value = 0;
            alert("d should be a number");
        }

        AppState.d = value;
        redraw();
    };
    dEl.onblur = dEl.onchange;

    downloadEl.onclick = () => {
        AppState.hiResP5Sketch.redraw();
    }
}

function InitializeHiResCanvas() {
    const hiresSketch = s => {
        AppState.hiResP5Sketch = s;

        s.setup = () => {
            s.createCanvas(AppState.hiResDim, AppState.hiResDim).hide();
            s.background(0);
        };

        s.draw = () => {
            if (AppState.n == 0 || AppState.d == 0) {
                s.noLoop();
                return;
            }

            s.background(0);

            let previousPoint = getCartesianPoint(AppState.n, 0, AppState.hiResDim);
            let previousOutlinePoint = getCartesianPoint(AppState.n, 0, AppState.hiResDim);

            for (let i = 1; i < 361; i++) {
                let p = getCartesianPoint(AppState.n, AppState.d * i, AppState.hiResDim);

                let op = getCartesianPoint(AppState.n, i, AppState.hiResDim);

                s.stroke("lime");
                s.strokeWeight(0.5);
                s.line(previousPoint.x, previousPoint.y, p.x, p.y);
                s.stroke("red");
                s.strokeWeight(3);
                s.line(previousOutlinePoint.x, previousOutlinePoint.y, op.x, op.y);
                previousPoint = p;
                previousOutlinePoint = op;
            }

            s.saveCanvas(`maurer_rose_n${AppState.n}_d${AppState.d}.png`);

            s.noLoop();
        }
    }

    new p5(hiresSketch);
}

function InitializeApp() {
    AttachListenersToInputs();
    InitializeHiResCanvas();
}