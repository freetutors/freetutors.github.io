const askQuestionButton = document.querySelector('.ask-question-button');

function checkVS() {
    if (window.innerWidth > document.body.clientWidth) {
        askQuestionButton.style.transform = `translateX(-15px)`;
    } else {
        askQuestionButton.style.transform = `translateX(0px)`;
    }

}

window.addEventListener('load', checkVS)
window.addEventListener('resize', checkVS)