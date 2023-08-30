const signPopUp = document.querySelector('.signPopUp');
const signUpAsTutor = document.querySelector('#sign_up_as_tutor_button');

var path = window.location.pathname;
var pageName = path.split("/").pop();

const username = localStorage.getItem('CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser');

if (username == null) {
  askQuestionButton.addEventListener('click', () => {
    signPopUp.innerHTML = `
      <p class="signPopUpText">You must be logged in to ask a question.</p>
      <div class="signPopUpLogin" onclick='location.href="login.html"'>Log in</div>
      <div class="signPopUpSignup" onclick='location.href="signup.html"'>Sign up</div>
      <div class="signPopUpX" onclick="document.querySelector('.signPopUp').style.display='none'"></div>
    `;
    signPopUp.style.display = 'block';
  });
if (pageName == 'createQuestion.html'){
  signPopUp.innerHTML = `
    <p class="signPopUpText">You must be logged in to ask a question.</p>
    <div class="signPopUpLogin" onclick='location.href="login.html"'>Log in</div>
    <div class="signPopUpSignup" onclick='location.href="signup.html"'>Sign up</div>
    <div class="signPopUpX" onclick="document.querySelector('signPopUp').style.display='none'"></div>
  `;
  signPopUp.style.display = 'block';
}
if (pageName == 'suggestions.html'){
  signPopUp.innerHTML = `
    <p class="signPopUpText">You must be logged in to make a suggestion.</p>
    <div class="signPopUpLogin" onclick='location.href="login.html"'>Log in</div>
    <div class="signPopUpSignup" onclick='location.href="signup.html"'>Sign up</div>
    <div class="signPopUpX" onclick="document.querySelector('signPopUp').style.display='none'"></div>
  `;
  signPopUp.style.display = 'block';
}
if (pageName == 'contactUs.html'){
  signPopUp.innerHTML = `
    <p class="signPopUpText">You must be logged in to contact us.</p>
    <div class="signPopUpLogin" onclick='location.href="login.html"'>Log in</div>
    <div class="signPopUpSignup" onclick='location.href="signup.html"'>Sign up</div>
    <div class="signPopUpX" onclick="document.querySelector('signPopUp').style.display='none'"></div>
  `;
  signPopUp.style.display = 'block';
}
} else {
  askQuestionButton.addEventListener('click', () => {
    window.location.href = "createQuestion.html";
  });
}