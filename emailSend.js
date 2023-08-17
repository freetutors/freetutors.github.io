import config from "./config.js";

const poolId = config.poolId //getting info from cognito
const clientId =config.clientId
const region = config.region
const accessKey = config.accessKey
const secretKey = config.secretKey

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

document.getElementById('username-send').addEventListener('click', function(event) {
    // event.preventDefafult();
    const username = document.getElementById('resetUsername').value;
    if(username == null){
      alert("Please enter your Username")
    }
    else{
      const params = {
        ClientId: clientId, // Replace with your Cognito App Client ID
        Username: username
      };
  
      // Call the forgotPassword API
      cognito.forgotPassword(params, function(err, data) {
        if (err) {
          console.error('Error:', err.message);
        } else {
          console.log('Password reset email sent:', data);
        }
      });
      localStorage.setItem("Username", username)
      window.location = "resetpwd"
    }
    // Create a CognitoIdentityServiceProvider object
    // Parameters for the forgotPassword API call
    
  });