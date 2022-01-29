// add dummy text to display
const current = document.querySelector("div.displayContents");
const history = document.querySelector(".history");

const converter = {
    "add": "+",
    "subtract": "-",
    "multiply": "\u00D7",
    "divide": "\u00F7"
}

let displayHist = "";
let displayCurr = "";
let decimalAllowed = true;
let currOp = "";
let currA = "";
let valA = null;
let continueA = true;
let currB = "";
let valB = null;
let continueB = false;
let needEval = false;
let opJustPressed = false;
let evalJustPressed = false;

function setup() {
    // set up event listeners for each of the input buttons
    const btns = document.querySelectorAll('.inputButton');
    btns.forEach(btn => btn.addEventListener("click", handleInput));
    
    // set up event listener for equals sign
    const equals = document.querySelector(".eval");
    equals.addEventListener("click", evaluate);

    // add keyboard support
    childrenNodes = new Array();
    const keys = document.querySelectorAll('.inputButton');
    keys.forEach(key => key.addEventListener('transitionend', removeTransition));
    document.querySelector('.eval').addEventListener('transitionend', removeTransition);
    console.log(keys);
    window.addEventListener('keydown', handleKeyboardInput);
}

setup();

function removeTransition(e) {
    if (e.propertyName !== 'background-color') return;
    e.target.classList.remove("keyPressed");
}

function handleKeyboardInput(e) {
    const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
    key.classList.add("keyPressed");
    key.click();
}


function handleInput(e) {
    /* This function determines whether
    a button or operator was pressed, and calls
    the correct function */
    let btn = e.target.className;
    if (btn.includes('inputButton')) {
        btn = [...e.target.children][0].className;
    }
    if (isNaN(btn)) {
        if (btn === ".") {
            numPressed(btn);
        } else if (btn === "clear") {
            clear();
        } else {
            operatorPressed(btn);
        }
    } else {
        numPressed(btn);
    }
}


function numPressed(btn) {
    opJustPressed = false;
    evalJustPressed = false;
    if (btn === '.' && !decimalAllowed) {
        return;
    } else if (btn === '.' && decimalAllowed) {
        decimalAllowed = false;
    }
    if (continueA) {
        history.textContent += btn;
        current.textContent += btn;
        currA += btn;
    } else {
        //continueB is true
        history.textContent += btn;
        currB += btn;
    }
}


function operatorPressed(btn) {
    if (opJustPressed) {
        currOp = btn;
        history.textContent = `${currA} ${converter[btn]} `;
    } else {
        opJustPressed = true;
        decimalAllowed = true;
        history.textContent += ` ${converter[btn]} `;

        if (continueA || evalJustPressed) {
            //no calculation needed
            currOp = btn;
            continueA = false;
            continueB = true;
            evalJustPressed = false;
        } else {
            //calculation needed before next operation hit
            let ans = operate(currA, currB, currOp);
            if (isNaN(ans)) {
                alert("You can't divide by zero!");
                clear();
            } else {
                currOp = btn;
                current.textContent = "= " + ans;
                currA = ans;
                currB = "";
                history.textContent = currA + ` ${converter[currOp]} `;
            }
            
        }
    }
}


function clear() {
    history.textContent = "";
    current.textContent = "";
    currOp = "";
    currA = "";
    valA = null;
    continueA = true;
    currB = "";
    valB = null;
    continueB = false;
}


function evaluate(e) {
    // ignore if we just pressed an operator or haven't chosen
    // one yet
    if (!opJustPressed && currOp){
        let ans = operate(currA, currB, currOp);
        if (isNaN(ans)) {
            alert("You can't divide by zero!");
            clear();
        } else {
            current.textContent = "= " + ans;
            currA = ans;
            currB = "";
        }
    }
    evalJustPressed = true;
}


function operate(a,b, operator) {
    decimalAllowed = true;
    switch (operator) {
        case "add":
            return parseFloat((+a + +b).toFixed(12));
        case "subtract":
            return parseFloat((a-b).toFixed(12));
        case "multiply":
            return parseFloat((a*b).toFixed(12));
        case "divide":
            return parseFloat((a/b).toFixed(12));
    }
}