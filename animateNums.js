/*const answers = localStorage.getItem("userAnswers")
const total = localStorage.getItem("totalQuestions")*/

const answers = 12343
const total = 3242

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function animate(valToAnimate, container, gear) {
  const strVal = String(valToAnimate);
  const numDigits = strVal.length;
  const digWheel = container.getElementsByClassName(gear);

  container.innerHTML = '';

  for (let i = 0; i < numDigits; i++) {
    container.innerHTML += `
      <div class=${gear}>
        <div class="dig">0</div>
        <div class="dig">1</div>
        <div class="dig">2</div>
        <div class="dig">3</div>
        <div class="dig">4</div>
        <div class="dig">5</div>
        <div class="dig">6</div>
        <div class="dig">7</div>
        <div class="dig">8</div>
        <div class="dig">9</div>
      </div>
    `;
  }

  await sleep(50);

  for (let i = 0; i < numDigits; i++) {
    digWheel[i].style.transform = 'translateY(-' + String(30 * strVal[i]) + 'px)';
  }
}

setTimeout(() => {
  animate(total, document.querySelector(".important_box_num1"), 'important_box_num1_digit')
  animate(answers, document.querySelector(".important_box_num2"), 'important_box_num2_digit')
  animate(Math.round(answers/5), document.querySelector(".important_box_num3"), 'important_box_num3_digit') 
}, 50);
