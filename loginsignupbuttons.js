// import config from "./config.js";
//manually importing config data from json cause ios errors
let data
async function getOptimizeConfig() {
    try {
        const response = await fetch('./optimize.json');
        const json = await response.json();
        data = processJSONData(json);

    } catch (error) {
      console.log(error);
    }
    return data;
}
function processJSONData(data) {
    var data = {
        apiUrlcreate : data.apiUrlcreate,
        apiUrlget  : data.apiUrlget,
        health  : data.health,
        apiUrlupdate  : data.apiUrlupdate,
        apiUrlanswer  : data.apiUrlanswer,
        apiUrlanswerUpdate  : data.apiUrlanswerUpdate,
        apiUrlgetUser  : data.apiUrlgetUser,
        apiUrlupdateUserRating: data.apiUrlupdateUserRating,
        apiUrlupdateAnswerRating: data.apiUrlupdateAnswerRating,
        // Import the necessary AWS SDK components
        poolId  : data.poolId, //getting info from cognito
        clientId  :data.clientId,
        region  : data.region,
        accessKey  : data.accessKey,
        secretKey  : data.secretKey,
    
        apiUrlCreateUser: data.apiUrlCreateUser,
        apiUrlupdateUser: data.apiUrlupdateUser,
        apiUrlupdateUserAnswer: data.apiUrlupdateUserAnswer,
    
        searchHost: data.searchHost,
        searchKey: data.searchKey
    }
    return data
}
var range=[0]
let old
for (const i in range){
    old = await getOptimizeConfig()
}
var config = old

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
const apiUrlgetUser = config.apiUrlgetUser //getting data
const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");
async function getUser(username){ //pulling user info
  const url = new URL(`${apiUrlgetUser}?username=${username}`);
  const user = await fetch(url,  {
      mode: "cors",
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      },
  }).then(response => response.json());
  return user
}
const askQuestion = document.getElementsByClassName("ask-question-button")[0];
if (username !== null) {
        askQuestion.style.right = "170px";
}
window.onhashchange = function() {
  location.reload()
};

if (username != null && window.innerWidth >= 800) { //if in localStorage
  const user = await getUser(username)
  const pfp = user.user[0].pfp
  const profileButton = document.createElement('div');
  const theme = getCookie("theme")
  let themeChange
  let themeChangeText
  if (!theme){
    setCookie('theme', 'dark',500)
  }
  else if (theme=="dark"){
    themeChange = "light"
    themeChangeText = "Light Mode"
  }
  else{
    themeChange = "dark"
    themeChangeText = "Dark Mode"
  }
  
  console.log(theme, themeChange, themeChangeText)
  profileButton.classList.add('profileButton');//info for profile click button
  profileButton.innerHTML = `
    <div class="notif"></div>
    <img class="inboxButton" src="inbox.png">
    <div class="userInfoContainerHome">
      <img class="profilePicHome" src="data:image/png;base64,${pfp}">
      <p class="usernameOnProfileButton">${username}</p>
      <div class="dropdown-profile">
      <div class="dropdown-content-profile">
        <a href="#" class="option go-to-profile">Profile</a>
        <a href="#" class="option" id="theme-change">${themeChangeText}</a>
        <a href="#" id="sign-out" class="option">Log Out</a>
      </div>
      </div>
    </div>
  `;
  profileButton.querySelector('.go-to-profile').addEventListener("click", function(event){
    event.preventDefault(); // Prevent the default action if needed
    window.location = `/profile?username=${username}`
  })
  profileButton.querySelector("#theme-change").addEventListener("click", () =>{
    setCookie("theme", themeChange,500)
    location.reload()
  })
  profileButton.querySelector("#sign-out").addEventListener("click",() => { //signout
    if (confirm("Do you want sign out?") == true){
      localStorage.clear()
      sessionStorage.clear()
      window.location ='/'
    }
  })
      var dropdown = profileButton.querySelector(".dropdown-profile");
      var dropdownContent = profileButton.querySelector(".dropdown-content-profile");
      var dropbtn = profileButton.querySelector(".userInfoContainerHome");

      dropbtn.addEventListener("click", function() {
        dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block"
      });

      dropdownContent.addEventListener("click", function(event) {
        if (event.target.classList.contains(".option")) {
          dropbtn.textContent = event.target.textContent;
          dropdownContent.style.display = "none"; // Always hide content after selecting an item
        }
      });
  
  const inbox = document.createElement('div'); //showing inbox
  inbox.classList.add('inbox');

  profileButton.appendChild(inbox);

  document.getElementById("loginSignupArea").innerHTML = '';
  document.getElementById("loginSignupArea").appendChild(profileButton);

    askQuestion.style.right = "190px";
} else {
  if(window.innerWidth >= 800){//for desktop only
    if (theme == "light"){
      document.getElementById("loginSignupArea").innerHTML = //other wise it will show login and signup buttons
      `<img class="color-change-icon" src="sunny.svg" width='30px' height='30px'></img>
      <button class="button login-button">Log in</button>
       <button class="button signup-button">Sign up</button>`;  
    }else{
      document.getElementById("loginSignupArea").innerHTML = //other wise it will show login and signup buttons
      `<img class="color-change-icon" src="moon.svg" width='25px' height='25px' style='margin-top: 2.3px;'></img>
      <button class="button login-button">Log in</button>
       <button class="button signup-button">Sign up</button>`;  
    }
  }
  if (theme == "light"){
    document.querySelector('.color-change-icon').setAttribute('src', "sunny.svg")
  }
  let themeChange
  let themeChangeText
  if (!theme){
    localStorage.setItem('theme', 'dark')
  }
  else if (theme=="dark"){
    themeChange = "light"
    themeChangeText = "Light Mode"
  }
  else{
    themeChange = "dark"
    themeChangeText = "Dark Mode"
  }
  console.log('hi')
  console.log(document.querySelector(".color-change-icon"))
  document.querySelector(".color-change-icon").addEventListener("click", () =>{
    console.log('fasdf')
    setCookie("theme", themeChange,500)
    location.reload()
  })
  document.querySelector(".login-button").addEventListener("click", () => {
    window.location = 'login';
  });

  document.querySelector(".signup-button").addEventListener("click", () => {
    window.location= "signup";
  });
}

if (username !== null) {
  const inbox = document.querySelector(".inboxButton")

  inbox.addEventListener('mouseover', () => {
    inbox.style.transform = 'scale(1.1)';
  });

  inbox.addEventListener('mouseout', () => {
    inbox.style.transform = 'scale(1)';
  });
}

if (username == null) {

}





