import config from "./config.js";
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
window.onhashchange = function() {
  location.reload()
};

if (username != null) { //if nothing in localStorage
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
        <a href="#" class="option" onclick = "window.location='/profile?username=${username}'">Profile</a>
        <a href="#" class="option" id="theme-change">${themeChangeText}</a>
        <a href="#" id="sign-out" class="option">Log Out</a>
      </div>
      </div>
    </div>
  `;
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
        console.log("hi")
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


} else {
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
  document.querySelector(".color-change-icon").addEventListener("click", () =>{
    localStorage.setItem("theme", themeChange)
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





