const signPopUp = document.querySelector('.signPopUp');
const askQuestionButton = document.querySelector('.ask-question-button')

var path = window.location.pathname;
var pageName = path.split("/").pop();

const username = localStorage.getItem('CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

if (username == null) {
  askQuestionButton.addEventListener('click', () => {
    signPopUp.innerHTML = `
      <p class="signPopUpText">You must be logged in to ask a question.</p>
      <div class="signPopUpLogin" onclick='location.href="login"'>Log in</div>
      <div class="signPopUpSignup" onclick='location.href="signup"'>Sign up</div>
      <div class="signPopUpX" onclick="document.querySelector('.signPopUp').style.display='none'"></div>
    `;
    signPopUp.style.display = 'block';
  });
if (pageName = 'index.html') {
  while (document.querySelector("#sign_up_as_tutor_button") == null) {
        await sleep(10)
      }
  document.querySelector("#sign_up_as_tutor_button").addEventListener('click', () => {
    signPopUp.innerHTML = `
      <p class="signPopUpText">You must be logged in to sign up as a tutor.</p>
      <div class="signPopUpLogin" onclick='location.href="login"'>Log in</div>
      <div class="signPopUpSignup" onclick='location.href="signup"'>Sign up</div>
      <div class="signPopUpX" onclick="document.querySelector('.signPopUp').style.display='none'"></div>
    `;
    signPopUp.style.display = 'block';
  });
}
if (pageName == 'createQuestion'){
  signPopUp.innerHTML = `
    <p class="signPopUpText">You must be logged in to ask a question.</p>
    <div class="signPopUpLogin" onclick='location.href="login"'>Log in</div>
    <div class="signPopUpSignup" onclick='location.href="signup"'>Sign up</div>
    <div class="signPopUpX" onclick="document.querySelector('signPopUp').style.display='none'"></div>
  `;
  signPopUp.style.display = 'block';
}
if (pageName == 'suggestions'){
  signPopUp.innerHTML = `
    <p class="signPopUpText">You must be logged in to make a suggestion.</p>
    <div class="signPopUpLogin" onclick='location.href="login"'>Log in</div>
    <div class="signPopUpSignup" onclick='location.href="signup"'>Sign up</div>
    <div class="signPopUpX" onclick="document.querySelector('signPopUp').style.display='none'"></div>
  `;
  signPopUp.style.display = 'block';
}
if (pageName == 'contactUs'){
  signPopUp.innerHTML = `
    <p class="signPopUpText">You must be logged in to contact us.</p>
    <div class="signPopUpLogin" onclick='location.href="login"'>Log in</div>
    <div class="signPopUpSignup" onclick='location.href="signup"'>Sign up</div>
    <div class="signPopUpX" onclick="document.querySelector('signPopUp').style.display='none'"></div>
  `;
  signPopUp.style.display = 'block';
}
} else {
  askQuestionButton.addEventListener('click', () => {
    window.location.href = "createQuestion";
  });
  if (pageName = 'index.html') {
  while (document.querySelector("#sign_up_as_tutor_button") == null) {
        await sleep(10)
      }
  document.querySelector("#sign_up_as_tutor_button").addEventListener('click', () => {
    window.location.href = "tutorSignUp";
  });
}
}