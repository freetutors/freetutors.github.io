import config from "./config.js";
//sending email to lamda and then to owners
var path = window.location.pathname;
var pageName = path.split("/").pop();

const poolId = config.poolId
const region = config.region
const accessKey = config.accessKey
const secretKey = config.secretKey
const questionBox = document.querySelector(".question_box")
const commentsBox = document.querySelector(".comments_box")
var dropbtn = document.querySelector(".dropbtn");
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

const sendEmailButton = document.querySelector(".submit-buttons");

const functionName = 'sendEmail';

const lambda = new AWS.Lambda();
const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")

async function getUserCognito(username) { //getting email and name from cognito
  try {
    const params = {
      UserPoolId: poolId,
      Username: username
    };

    const user = await cognito.adminGetUser(params).promise();
    return user;
  } catch (error) {
      alert("error:"+error+"Please log out and log in again")
  }
}

sendEmailButton.addEventListener("click", async () => {
  console.log('asdf')
  if (username == null){
    if(window.confirm("Please Log In to Contact Us"));{
      window.location = "/login"
    }
  }
  else if(!questionBox.value.trim() || !commentsBox.value.trim()){
    alert("Please Fill Out All the Boxes")
  }
  else{
    if (window.location.pathname.indexOf("/contactUs") !== -1) {
      var feedbackType = dropbtn.innerHTML + ": "
      var feedbackType = feedbackType.replace(/\r?\n|\r/g, '');
    } else {
      var feedbackType = ""
    }
  const user = await getUserCognito(username) //getting user info with previous username
const email = "          Account Email:" + user.UserAttributes[4].Value //letting us know ur email

    console.log("user")
  
    var subject = questionBox.value.trim().replace(/\r?\n|\r/g, '').replace(/"/g, "‟").replace(/"/g, '⁄').replace(/\\/g, '＼');
  
    var body = commentsBox.value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼') + email;
  
    const payload = {
      "body": "{\"subject\": \"" + feedbackType + subject + "\", \"body\": \"" + body + "\"}"
    };
  
    const params = {
      FunctionName: functionName,
      Payload: JSON.stringify(payload),
    };
  
    lambda.invoke(params, (err, data) => {
      if (err) {
        console.error('Error calling the Lambda function:', err);
        alert("Suggestion Sent")
        window.location = '/'
      } else {
        console.log('Response from Lambda:', data.Payload);
        alert("Error sending suggestion, try again later.")
      }
    });


  }

});