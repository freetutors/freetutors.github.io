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


const poolId =config.poolId //getting info from cognito

const clientId = config.clientId
const region = config.region
const accessKey = config.accessKey
const secretKey = config.secretKey

AWS.config.region = region; //telling what region to search
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ //COnnecting to pool
  IdentityPoolId: poolId 
});

AWS.config.update({ //getting conection to IAM user
  region: region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey
});


var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy

function loginUser(username, password) { //user auth data
    const authenticationData = {
      Username: username,
      Password: password
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const poolData = { //pool data
        UserPoolId: poolId,
        ClientId: clientId
      };
    
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const userData = { //user data target
        Username: username,
        Pool: userPool
      };
    
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
          // User authentication successful 
          const accessToken = result.getAccessToken().getJwtToken();
          window.accessToken = accessToken //this is globalizing a logged in user in the whole webpage
          window.location="/"
        },
        onFailure: function(err) { //giving user info based on incorrect info
            if (err.code === 'NotAuthorizedException') {
                alert('Incorrect Password!')
            }
            if (err.code === 'UserNotFoundException') {
                alert('User not found. Check if your username is typed correctly!')
            }
            if (err.code ==="UserNotConfirmedException") {
              if(window.confirm("Please verify your account.")){
                window.location = "/verification.html"
              }
            }
          // User authentication failed
          console.error(err);
        }
      });
    }
    document.querySelector('.login-send').addEventListener("click", function(e){ //when login button clicked
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        loginUser(username, password);
    }) 
    document.getElementById('password').addEventListener("keyup", function(event) { //when enter key pressed
      if (event.key === "Enter") {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        loginUser(username, password);
      }
    })