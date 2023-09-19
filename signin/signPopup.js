const signPopUp = document.querySelector('.signPopUp');
const welcomePopUp = document.querySelector('.welcomePopUp')
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
   setCookie('usage', 'first', 365) //un comment this when the popup is ready this is for testing
   console.log('hi')
   welcomePopUp.innerHTML = `
       <p class="welcomeText welcome"><b>Welcome to FreeTutors.net!</b></p>
       <img class ="welcomeMascot left" id="mascot" src="final_mascot.svg" alt="mascot" style="left: 10px; padding-up: 20px; display: inline-block; width: 120px;">
       <p class="signPopUpText" style="position: relative; margin-top: 0px; padding-left: 20px; display: inline-block; width: 300px; font-size:24px; text-align: center; align: center; overflow-wrap:break-word; word-wrap:break-word; vertical-align: top;">We're a <b>FREE</b> to use Q&A site for all your school needs.
       <br/>
       <b>NO SUBSCRIPTIONS.</b>
       <br/> 
       It's simple. Just ask any question and get answers
       </p>
       <br/>
       <p class="welcomeText end" style="font-size:24px;">Need volunteer hours? <b>Coming soon on FreeTutors!</b></p>
       <button class="welcomeSignUpButton" style="height: 80px; width: 200px; background-color: var(--secondary-color); border-radius: 12.5px;" onclick="window.location='signUp'">Sign Up</button>
       <!-- 
       Buttons are not styled properly/fully
       -->
       <button class="welcomeAboutUsButton" style="height: 30px; width: 200px; background-color: var(--primary-color); border-radius: 12.5px; padding-bottom: 5px;" onclick="window.location='contactUs'">Contact Us</button>
       <button class="welcomeAboutUsButton" style="height: 30px; width: 200px; background-color: var(--primary-color); border-radius: 12.5px; padding-top: 5px;" onclick="window.location='ourTeam'">About Us</button>
       <div class="signPopUpX" onclick="document.querySelector('.welcomePopUp').style.display='none'"></div>
     `;
     welcomePopUp.style.display = 'block';
 }
if (username == null) {
  askQuestionButton.addEventListener('click', () => {
    signPopUp.innerHTML = `
      <p class="signPopUpText" style="inset: 0">You must be logged in to ask a question.</p>
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
      <p class="signPopUpText" style="inset: 0">You must be logged in to sign up as a tutor.</p>
      <div class="signPopUpLogin" onclick='location.href="login"'>Log in</div>
      <div class="signPopUpSignup" onclick='location.href="signup"'>Sign up</div>
      <div class="signPopUpX" onclick="document.querySelector('.signPopUp').style.display='none'"></div>
    `;
    signPopUp.style.display = 'block';
  });
}
if (pageName == 'createQuestion'){
  signPopUp.innerHTML = `
    <p class="signPopUpText" style="inset: 0">You must be logged in to ask a question.</p>
    <div class="signPopUpLogin" onclick='location.href="login"'>Log in</div>
    <div class="signPopUpSignup" onclick='location.href="signup"'>Sign up</div>
    <div class="signPopUpX" onclick="document.querySelector('signPopUp').style.display='none'"></div>
  `;
  signPopUp.style.display = 'block';
}
if (pageName == 'suggestions'){
  signPopUp.innerHTML = `
    <p class="signPopUpText" style="inset: 0">You must be logged in to make a suggestion.</p>
    <div class="signPopUpLogin" onclick='location.href="login"'>Log in</div>
    <div class="signPopUpSignup" onclick='location.href="signup"'>Sign up</div>
    <div class="signPopUpX" onclick="document.querySelector('signPopUp').style.display='none'"></div>
  `;
  signPopUp.style.display = 'block';
}
if (pageName == 'contactUs'){
  signPopUp.innerHTML = `
    <p class="signPopUpText" style="inset: 0">You must be logged in to contact us.</p>
    <div class="signPopUpLogin" onclick='location.href="login"'>Log in</div>
    <div class="signPopUpSignup" onclick='location.href="signup"'>Sign up</div>
    <div class="signPopUpX" onclick="document.querySelector('signPopUp').style.display='none'"></div>
  `;
  signPopUp.style.display = 'block';
}
} else {
  askQuestionButton.addEventListener('click', () => {
    if (checkCookieExists('createCooldown')){
      alert("Pleast wait 5 minutes before posting another question.")
    }else{
      window.location = "/createQuestion"
    }
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
