const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");
function inboxDisplay() {

  const inbox = document.querySelector('.inbox');
  console.log(inbox.style.display);

  if ((inbox.style.display === "none") || (inbox.style.display === "")) {
    inbox.style.display = "block";
  } else {
    inbox.style.display = "none";
  }
}

if (username != null) {
  const profileButton = document.createElement('div');
  profileButton.classList.add('profileButton');
  profileButton.innerHTML = `
    <img class="inboxButton" src="inbox.png" onclick="inboxDisplay()">
    <div class="userInfoContainerHome" onclick="window.location = 'profile'">
      <img class="profilePicHome" src="profileDefault.jpg">
      <p class="usernameOnProfileButton">${username}</p>
    </div>
  `;


  const inbox = document.createElement('div');
  inbox.classList.add('inbox');
  inbox.innerHTML = `
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaa</div>
    <div class="inboxTime">December 22</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine"><div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine"><div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine"><div class="inboxLetters">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    <div class="inboxTime">Today</div>
    <hr class="inboxLine">
    <div class="inboxLetters">aaa</div>
    <div class="inboxTime">December 22</div>
  `;

  profileButton.appendChild(inbox);

  document.getElementById("loginSignupArea").innerHTML = '';
  document.getElementById("loginSignupArea").appendChild(profileButton);

} else {
  document.getElementById("loginSignupArea").innerHTML =
  `<button class="button login-button">Log in</button>
   <button class="button signup-button">Sign up</button>`;

  document.querySelector(".login-button").addEventListener("click", () => {
    window.location.location = 'login';
  });

  document.querySelector(".signup-button").addEventListener("click", () => {
    window.location= "signup";
  });
}

