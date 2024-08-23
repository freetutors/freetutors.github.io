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

document.getElementById('newPwd-send').addEventListener('click', function(event) {
  event.preventDefault();
  const verificationCode = document.getElementById('pwdCode').value; //getting values from html
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
          alert("Invalid Code: Please Try Again") //letting user know if error is on their part
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
