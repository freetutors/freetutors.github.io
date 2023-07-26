let currNum
let ticks;
let fresh = true;
const time = 1000;

const stat = document.querySelector('#number')

function scrollNumber(digits) {
    stat.querySelectorAll('span[data-value]').forEach((tick, i) => {
        tick.style.transform = `translateY(-${100 * parseInt(digits[i])}%)`;
    })

    setTimeout(() => {
        stat.style.width = `${digits.length * 28}px`;
    }, 100)
}

function addDigit(digit, fresh) {
    const spanList = Array(10)
        .join(0)
        .split(0)
        .map((x, j) => `<span>${j}</span>`)
        .join('')

    stat.insertAdjacentHTML(
        "beforeend",
        `<span style="transform: translateY(-1000%)" data-value="${digit}">
        ${spanList}
      </span>`)

    const firstDigit = stat.lastElementChild

    setTimeout(() => {
        firstDigit.className = "visible";
    }, fresh ? 0 : 2000);
}

function removeDigit() {
    const firstDigit = stat.lastElementChild
    firstDigit.classList.remove("visible");
    setTimeout(() => {
        firstDigit.remove();
    }, 2000);
}

function setup(startNum) {
    const digits = startNum.toString().split('')

    for (let i = 0; i < digits.length; i++) {
        addDigit('0', true)
    }

    scrollNumber(['0'])

    setTimeout(() => scrollNumber(digits), 2000)
    currNum = startNum
}

function rollToNumber(idx, num) {
    el.style.transform = `translateY(-${100 - num * 10}%)`;
}

function update(num) {
    if (!num) {
        num = Math.round(Math.random() * 100)
    }
    const toDigits = num.toString().split('')
    const fromDigits = currNum.toString().split('')

    for (let i = fromDigits.length - toDigits.length; i > 0; i--) {
        removeDigit()
    }
    for (let i = toDigits.length - fromDigits.length; i > 0; i--) {
        addDigit(toDigits[i]);
    }

    scrollNumber(toDigits)
    currNum = num
}

setup(521)