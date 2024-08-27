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
  return false; //allows for new account
}};

document.getElementById('username-send').addEventListener('click', function(event) {
    // event.preventDefafult();
    const email = document.getElementById('resetUsername').value;
    if(email == null || email == ""){
      alert("Please enter your email address")
    }
    else{
      checkExistingUser(email).then(username => {
      if (username === false){
        alert("This email is not in our database. Please sign up with a new account.")
        window.location = "/SignUp"
      } else {
        console.log(username)
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
        // window.location = "/resetpwd"
      }})
}
     
    // Create a CognitoIdentityServiceProvider object
    // Parameters for the forgotPassword API call
    
  });