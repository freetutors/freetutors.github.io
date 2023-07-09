//This code will be used for changing the login and signup button area
//to the profile area
const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")
// const username = "dfghjk" //for testing
console.log(username)
if (username != null){
    // const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")
    document.getElementById("loginSignupArea").innerHTML =
    `
    <div class = "profileButton">
        <img class = "profilePicHome" src="profileDefault.jpg">
        <p class = "usernameOnProfileButton">${username}</p>
    </div>
    `
    document.querySelector(".profilePicHome").
    addEventListener("click", () => {
        window.location='profile.html'
    });
    document.querySelector(".usernameOnProfileButton").
    addEventListener("click", () => {
        window.location='profile.html'
    });   
}
else{
    document.getElementById("loginSignupArea").innerHTML =
    `<button class="button login-button">Log in</button>
    <button class="button signup-button">Sign up</button>`
    //setting login button to redirect
    document.querySelector(".login-button").
    addEventListener("click", () => {
        window.location='login.html'
    }); 
    //setting signup button to redirect
    document.querySelector(".signup-button").
    addEventListener("click", () => {
        window.location='signup.html'
    });
}

const askQuestionButton = document.querySelector('.ask-question-button');
const loginButton = document.querySelector('.login-button');
const signupButton = document.querySelector('.signup-button');

function checkVS() {
    if (window.innerWidth > document.body.clientWidth) {
        console.log(true);
        askQuestionButton.style.transform = `translateX(-15px)`;
    } else {
        askQuestionButton.style.transform = `translateX(0px)`;
    }

}

window.addEventListener('load', checkVS)
window.addEventListener('resize', checkVS)