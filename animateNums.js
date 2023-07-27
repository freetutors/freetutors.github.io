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

  await sleep(100);

  for (let i = 0; i < numDigits; i++) {
    digWheel[i].style.transform = 'translateY(-' + String(30 * strVal[i]) + 'px)';
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  animate(2048, document.querySelector(".important_box_num1"), 'important_box_num1_digit')
  animate(91, document.querySelector(".important_box_num2"), 'important_box_num2_digit')
  animate(520, document.querySelector(".important_box_num3"), 'important_box_num3_digit')
});
