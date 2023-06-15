
// const loginService = require('./service/login'); // connection to 
import Amplify from 'aws-amplify'
Amplify.configure({
    Auth:{
        cognito: {
            userPoolId: 'us-west-1_p8Yc1jkno',
            userPoolClientId: '	70fja60algpc90okhqoru49592', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
            region: 'us-west-1' // e.g. us-east-2
        },
        api: {
            invokeUrl: '' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
        }
    }

});

document.querySelector(".login-send"). // connecting to login button
addEventListener("click", async() => { //pulling information on click
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const user = { //getting userinfo from 
        "username": username,
        "password": password
    }

    // const loginBody = JSON.parse(user);
    // response = loginService.login(loginBody);

    // console.log(user)
    // const loginRequest = new XMLHttpRequest();
    // request.open('POST', '/login', true)
    // console.log(opened)
    // request.setRequestHeader('Content-Type', 'application/json')

    // request.send(JSON.stringify(user));        
    try {
        await Auth.confirmSignUp(username, password);
        console.log("Confirmation successful");
        // Redirect to a different page or perform other actions
      } catch (error) {
        console.log("Confirmation error:", error);
        // Handle confirmation error, display error message to the user
      }
    

});


