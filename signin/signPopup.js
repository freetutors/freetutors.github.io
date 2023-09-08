const signPopUp = document.querySelector('.signPopUp');
const askQuestionButton = document.querySelector('.ask-question-button')
var path = window.location.pathname;
var pageName = path.split("/").pop();

const username = localStorage.getItem('CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function checkCookieExists(cookieName) { //checking cookie
  return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(`${cookieName}=`));
}
// Function to set a cookie with a given name and value
function setCookie(cookieName, cookieValue, expirationDays) { //creating cookie
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);

  const cookie = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookie;
}
function getCookie(name) {
  var cookieArr = document.cookie.split(";");
  for(var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      if(name == cookiePair[0].trim()) {
          return decodeURIComponent(cookiePair[1]);
      }
  }
  return null;
}

if (!checkCookieExists("usage") || getCookie("usage") == "new"){
  // setCookie('usage', 'first', 365) //un comment this when the popup is ready this is for testing
  console.log('hi')
  signPopUp.innerHTML = `
      <p class="welcomeText welcome">Welcome To FreeTutors!</p>
      <p class="welcomeText">We're a free to use q and a website for all of you. All you have to do is ask 
      a question and get answers from other users. You can also sign up to be a verified tutor, and in the future you can earn volunteer hours(not yet though)
      <img class ="welcomeLogo" id="logo" src="Logo.svg" alt="Logo">
      <div class="signPopUpX" onclick="document.querySelector('.signPopUp').style.display='none'"></div>
    `;
    signPopUp.style.display = 'block';
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