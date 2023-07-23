import config from "./config.js";

const poolId = config.poolId //getting info from cognito
const clientId =config.clientId
const region = config.region
const accessKey = config.accessKey
const secretKey = config.secretKey
usingUsernameInput = false
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
AWS_SDK_LOAD_CONFIG=1

if (localStorage.getItem("signupUsername") === null){
    usingUsernameInput = true;
    document.getElementById("input-group-new").innerHTML =
    `
    <label>Verification Number:</label>
    <p class="description">Check your email for a verification number</p>
    <input type="text" id="username" class="username login-input"
    placeholder="Enter Your Username">
    <input type="number" id="vCode" class="vCode login-input"
    placeholder="Enter Your Verification Number">
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
        alert('Verification failed. Please try again.');
        localStorage.clear();
      } else {
        console.log(data);
        alert('Verification successful! You can now sign in.');
        window.location = 'https://freetutors.github.io/profile'
      }
    });
  }
  
  document.querySelector('.verification-send').addEventListener('click', function () {
    console.log("clicked")
    const verificationCode = document.getElementById("vCode").value;
    var username = "not yet set"
    if (usingUsernameInput == true){
        username = document.getElementById("username").value;
    }
    else{
        username = localStorage.getItem('signupUsername');
    }
    verifyUser(username, verificationCode);
  }); 

