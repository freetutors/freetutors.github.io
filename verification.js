// import config from "./config.js";

//manually importing config data from json cause ios errors
let data
async function getOptimizeConfig() {
    try {
        const response = await fetch('./optimize.json');
        const json = await response.json();
        data = processJSONData(json);

    } catch (error) {
      console.log(error);
    }
    return data;
}
function processJSONData(data) {
    var data = {
        apiUrlcreate : data.apiUrlcreate,
        apiUrlget  : data.apiUrlget,
        health  : data.health,
        apiUrlupdate  : data.apiUrlupdate,
        apiUrlanswer  : data.apiUrlanswer,
        apiUrlanswerUpdate  : data.apiUrlanswerUpdate,
        apiUrlgetUser  : data.apiUrlgetUser,
        apiUrlupdateUserRating: data.apiUrlupdateUserRating,
        apiUrlupdateAnswerRating: data.apiUrlupdateAnswerRating,
        // Import the necessary AWS SDK components
        poolId  : data.poolId, //getting info from cognito
        clientId  :data.clientId,
        region  : data.region,
        accessKey  : data.accessKey,
        secretKey  : data.secretKey,
    
        apiUrlCreateUser: data.apiUrlCreateUser,
        apiUrlupdateUser: data.apiUrlupdateUser,
        apiUrlupdateUserAnswer: data.apiUrlupdateUserAnswer,
    
        searchHost: data.searchHost,
        searchKey: data.searchKey
    }
    return data
}
var range=[0]
let old
for (const i in range){
    old = await getOptimizeConfig()
}
var config = old

const poolId = config.poolId //getting info from cognito
const clientId =config.clientId
const region = config.region
const accessKey = config.accessKey
const secretKey = config.secretKey
let usingUsernameInput = false
AWS.config.region = region; //telling what region to search
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ //COnnecting to pool
  IdentityPoolId: poolId 
});

AWS.config.update({ //updating info
  region: region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey
});

var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy

if (localStorage.getItem("signupUsername") === null){
    usingUsernameInput = true;
    document.getElementById("input-group-new").innerHTML = //changing html based on if username is found or not
    `
    <label>Verification Number:</label>
    <p class="description">Check your email for a verification number</p>
    <input type="text" id="username" class="username login-input"
    placeholder="Enter Your Email Address">
    <input type="number" id="vCode" class="vCode login-input"
    placeholder="Enter Your Verification Number">
    <a id = "resend-email" class="resend">Resend Email?</a>

    <button class="button verification-send" id="verification-send">Verify</button>
    `
}
function verifyUser(username, verificationCode) { //verified account
    const params = {
      ClientId: clientId,
      Username: username,
      ConfirmationCode: verificationCode,
    };
  
    cognito.confirmSignUp(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        alert('Verification failed. Please try again.'); //verification details
        // localStorage.clear();
      } else {
        console.log(data);
        alert('Verification successful! You can now sign in.');
        localStorage.clear()
        window.location = `/login`
      }
    });
  }
  async function checkExistingUser(email) { //checking for a duplicate email because thats the only one config doesnt autocheck
    const params = { //This is telling what the code should look for(used later)
      AttributesToGet: [ "email" ],
      Filter: `email = "${email}"`, //Pulling users from database based on email adress
      UserPoolId: poolId
   }
  
   const users = await cognito.listUsers(params).promise(); //this calls the above params and looks for accounts with the same email as the provided one
  
   if (users && users.Users.length > 0) { //Checks if there are more the zero of said accounts
    const userExists = users.Users[0].Username; 
    return userExists; 
  } else {
    return false; //
  }};
  document.getElementById('resend-email').addEventListener('click', function () {
    var username = "not yet set"; //setting arbitrary value for global variable

    if (usingUsernameInput == true) { //if user is not coming directly from the sign up page
      console.log("a")
      var email = document.getElementById("username").value; //it is called "username" just because cognito only reads that, it is actually an email
      checkExistingUser(email).then(user => { //checks for email, in promise form because it isnt instant
        if (user === false){
          alert("Put the email address for your account in the email section first.")
        } else {
          username = user.trim()
          console.log(username)
        }
        console.log(username) //this is a username
        resendVerificationCode(username); 
        });
    } else {
      username = localStorage.getItem('signupUsername'); //if from sign up page then no need for email as the username is already known
      resendVerificationCode(username);
    }
    console.log(username)


  });
  function resendVerificationCode(username) {
    const params = {
      ClientId: clientId,
      Username: username,
    };
  
    cognito.resendConfirmationCode(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        alert('Failed to resend verification code. Please try again later.');
      } else {
        console.log(data);
        alert('Verification code resent successfully! Please check your email.');
      }
    });
  }
  document.querySelector('.verification-send').addEventListener('click', function () { //upon sending data
    const verificationCode = document.getElementById("vCode").value;
    var username = "not yet set" //setting arbitrary value for global variable
    if (usingUsernameInput == true){
        username = document.getElementById("username").value;
    }
    else{
        username = localStorage.getItem('signupUsername');
    }
    verifyUser(username, verificationCode);
  }); 

