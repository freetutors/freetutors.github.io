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


if (username != null) { //if nothing in localStorage
  const user = await getUser(username)
  const pfp = user.user[0].pfp
  const profileButton = document.createElement('div');
  profileButton.classList.add('profileButton');//info for profile click button
  console.log(profileButton)
  profileButton.innerHTML = `
    <div class="notif"></div>
    <img class="inboxButton" src="inbox.png">
    <div class="userInfoContainerHome" onclick="window.location = 'profile?username=${username}'">
      <img class="profilePicHome" src="data:image/png;base64,${pfp}">
      <p class="usernameOnProfileButton">${username}</p>
    </div>
  `;

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
const inbox = document.querySelector(".inboxButton")

  inbox.addEventListener('mouseover', () => {
    inbox.style.transform = 'scale(1.1)';
  });

  inbox.addEventListener('mouseout', () => {
    inbox.style.transform = 'scale(1)';
  });



