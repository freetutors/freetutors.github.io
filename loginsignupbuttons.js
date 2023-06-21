//This code will be used for changing the login and signup button area
//to the profile area
const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")
console.log(username)
if (username != null){
    // const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")
    document.getElementById("loginSignupArea").innerHTML +=
    `
    <div class = "profilebutton">
        <img class = "profilePicHome" src="profileDefault.jpg">
        <p class = "usernameOnProfileButton">${username}</p>
    </div>
    `
}
// let loggedin = false //currently its hard coded but itll change with backend integration
// if (loggedin == true){ //if logged in it'll create a button that shows the username and goes to the profile
//     document.getElementById("loginSignupArea").innerHTML +=
//     `
//     <div class = "profilebutton">
//         <img class = "profilePicHome" src="profileDefault.jpg">
//         <p class = "usernameOnProfileButton">Usernameasdfasdf</p>
//     </div>
//     `
// }
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