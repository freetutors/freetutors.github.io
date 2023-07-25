import config from "./config.js";

const apiUrlgetUser = config.apiUrlgetUser
const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");
async function getUser(username){
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



if (username != null) {
  const user = await getUser(username)
  const pfp = user.user[0].pfp
  const profileButton = document.createElement('div');
  profileButton.classList.add('profileButton');
  profileButton.innerHTML = `
    <img class="inboxButton" src="inbox.png" onclick="inboxDisplay()">
    <div class="userInfoContainerHome" onclick="window.location = 'profile?username=${username}'">
      <img class="profilePicHome" src="data:image/png;base64,${pfp}">
      <p class="usernameOnProfileButton">${username}</p>
    </div>
  `;



  const inbox = document.createElement('div');
  inbox.classList.add('inbox');

  profileButton.appendChild(inbox);

  document.getElementById("loginSignupArea").innerHTML = '';
  document.getElementById("loginSignupArea").appendChild(profileButton);


} else {
  document.getElementById("loginSignupArea").innerHTML =
  `<button class="button login-button">Log in</button>
   <button class="button signup-button">Sign up</button>`;

  document.querySelector(".login-button").addEventListener("click", () => {
    console.log("clicked")
    window.location = 'login';
  });

  document.querySelector(".signup-button").addEventListener("click", () => {
    window.location= "signup";
  });
}



