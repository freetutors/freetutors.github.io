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
console.log("called")
var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy

document.getElementById('newPwd-send').addEventListener('click', function(event) {
  event.preventDefault();
  console.log("clicked")
  const verificationCode = document.getElementById('pwdCode').value;
  const newPassword = document.getElementById('newPwd').value;
  const confirmPassword = document.getElementById("newPwdConfirm").value
  if (newPassword==confirmPassword){
    const params = {
      ClientId: clientId, // Replace with your Cognito App Client ID
      Username: localStorage.getItem("Username"), // Replace with the user's email
      ConfirmationCode: verificationCode,
      Password: newPassword
    };
  
    // Call the confirmForgotPassword API
    cognito.confirmForgotPassword(params, function(err, data) {
      if (err) {
        console.log(err)
        if (err.code === "ExpiredCodeException"){
          alert("Invalid Code: Please Try Again")
        }
        else{
          alert("Invalid Password")
        }
        // Handle the error here (e.g., display an error message to the user)
      } else {
        console.log('Password reset confirmed:', data);
        // Handle the success here (e.g., display a success message to the user)
      }
    });
    window.location = "/"
  }
  else{
    alert("Passwords do not match!")
  }
  // Parameters for the confirmForgotPassword API call

});
