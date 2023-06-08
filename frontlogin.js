
// const loginService = require('./service/login'); // connection to 

document.querySelector(".login-send"). // connecting to login button
addEventListener("click", () => { //pulling information on click
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const user = { //getting userinfo from 
        "username": username,
        "password": password
    }
    
    // const loginBody = JSON.parse(user);
    // response = loginService.login(loginBody);

    console.log(user)
    const loginRequest = new XMLHttpRequest();
    request.open('POST', '/login', true)
    console.log(opened)
    request.setRequestHeader('Content-Type', 'application/json')

    request.send(JSON.stringify(user));        


});

