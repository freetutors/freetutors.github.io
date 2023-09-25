import config from "./config.js";

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
  const theme = localStorage.getItem("theme")
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
        <a href="#" class="option" onclick = "window.location='/profile'">Profile</a>
        <a href="#" class="option" id="theme-change">${themeChangeText}</a>
        <a href="#" id="sign-out" class="option">Log Out</a>
      </div>
      </div>
    </div>
  `;
  profileButton.querySelector("#theme-change").addEventListener("click", () =>{
    localStorage.setItem("theme", themeChange)
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
  document.getElementById("loginSignupArea").innerHTML = //other wise it will show login and signup buttons
  `<button class="button login-button">Log in</button>
   <button class="button signup-button">Sign up</button>`;

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





