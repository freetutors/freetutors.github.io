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
        window.location='https://freetutors.github.io/profile'
    });
    document.querySelector(".usernameOnProfileButton").
    addEventListener("click", () => {
        window.location='https://freetutors.github.io/profile'
    });   
}
else{
    document.getElementById("loginSignupArea").innerHTML =
    `<button class="button login-button">Log in</button>
    <button class="button signup-button">Sign up</button>`
    //setting login button to redirect
    document.querySelector(".login-button").
    addEventListener("click", () => {
        window.location='https://freetutors.github.io/login'
    }); 
    //setting signup button to redirect
    document.querySelector(".signup-button").
    addEventListener("click", () => {
        window.location='https://freetutors.github.io/signup'
    });
}

