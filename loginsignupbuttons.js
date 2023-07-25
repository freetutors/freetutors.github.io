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

function inboxDisplay() {
  const inbox = document.querySelector('.inbox');

  if ((inbox.style.display === "none") || (inbox.style.display === "")) {
    inbox.style.display = "block";
  } else {
    inbox.style.display = "none";
  }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getTimeDifference(timestamp) {
  const currentTime = new Date();
  const previousTime = new Date(timestamp);
  const timeDiff = currentTime.getTime() - previousTime.getTime();

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }
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
  for (const message of user.user[0].InboxList) {
    inbox.innerHTML +=
    `
      <div class="inboxLetters">${message[0]}</div>
      <div class="inboxTime">${getTimeDifference(message[1])}</div>
      <hr class="inboxLine">
    `
  }


  profileButton.appendChild(inbox);

  document.getElementById("loginSignupArea").innerHTML = '';
  document.getElementById("loginSignupArea").appendChild(profileButton);

  document.querySelector('.inboxButton').addEventListener("click", inboxDisplay)


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



