document.addEventListener('DOMContentLoaded', InitializeApp);

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const biggerDim = screenHeight > screenWidth ? screenHeight : screenWidth;
const smallerDim = screenHeight < screenWidth ? screenHeight : screenWidth;

const AppState = {
    n: 0,
    d: 0,
};

function _(z) {
    return document.getElementById(z);
}

function setup() {

    AppState.canvasDim = Math.ceil(smallerDim/1.05);
    let canvasWidth = AppState.canvasDim;
    let canvasHeight = AppState.canvasDim;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent("canvas-container");

    background(0);

}

function getCartesianPoint(n, theta) {
    theta *= (Math.PI / 180);
    let r = Math.sin(n * theta);

    let x = r * Math.sin(theta);
    let y = r * Math.cos(theta);

    x = map(x, 1, -1, 0, AppState.canvasDim);
    y = map(y, 1, -1, 0, AppState.canvasDim);

    return { x, y };
}

function draw() {

    if (AppState.n == 0 || AppState.d == 0) return;

    background(0);

    let previousPoint = getCartesianPoint(AppState.n, 0);
    let previousOutlinePoint = getCartesianPoint(AppState.n, 0);

    for (let i = 1; i < 361; i++) {
        let p = getCartesianPoint(AppState.n, AppState.d * i);

        let op = getCartesianPoint(AppState.n, i);

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

    }
}

function InitializeApp() {
    AttachListenersToInputs();
}