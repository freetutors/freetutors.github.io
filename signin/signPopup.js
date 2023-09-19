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
  //  setCookie('usage', 'first', 365) //un comment this when the popup is ready this is for testing
   console.log('hi')
   signPopUp.innerHTML = `
       <p class="welcomeText welcome"><b>Welcome to FreeTutors.net!</b></p>
       <img class ="welcomeMascot left" id="mascot" src="final_mascot.svg" alt="mascot" style="position: absolute; margin-left: 20px; left:10px; up: 10px; width: 130px;">
       <p class="welcomeText right" style="padding-left: 200px; right:10px; up:50px; left:100px; font-size:24px; text-align:center; overflow-wrap:break-word; word-wrap:break-word;">We are a <b>FREE</b> to use Q&A site for all your school needs.
       <br/>
       <b>NO SUBSCRIPTIONS.</b>
       <br/> 
       It's simple. Just ask any question and get answers.
       </p>
       <p class="welcomeText end" style="font-size:24px;">Need volunteer hours? <b>Coming soon on FreeTutors!</b></p>
       <div class="buttons">
       <div class="button sign-up-button" onclick="window.location='/signup'">Sign Up</div>
       <div class="button-column">
         <div class="button contact-button"onclick="window.location='/contactUs'">Contact Us</div>
         <div class="button about-button"onclick="window.location='/ourTeam'">About Us</div>
       </div>
     </div>
     <p class="popup-link">Follow us <a class="insta" href = "https://www.instagram.com/freetutorsdotnet/">@freetutorsdotnet </a>for more updates</p>
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