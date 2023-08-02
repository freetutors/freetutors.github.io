import config from "./config.js";
//sending email to lamda and then to owners
var path = window.location.pathname;
var pageName = path.split("/").pop();
const questionBox = document.querySelector(".question_box")
const commentsBox = document.querySelector(".comments_box")
var dropbtn = document.querySelector(".dropbtn");

const poolId =config.poolId //getting info from cognito
const region = config.region
AWS.config.region = region; //telling what region to search
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ //COnnecting to pool
  IdentityPoolId: poolId 
});

AWS.config.update({ //initializing aws services
  region: 'us-west-1',
  credentials: new AWS.Credentials(config.accessKey, config.secretKey),
});
var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy

const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")
if (username == null){
  if(window.confirm("Please Log In to Contact Us"));{
    window.location = "/login"
  }
}
async function getUserCognito(username) { //getting cognito info
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
const user = await getUserCognito(username) //getting user info with previous username
const email = "          Account Email:" + user.UserAttributes[4].Value //letting us know ur email

const sendEmailButton = document.querySelector(".buttons");

const functionName = 'sendEmail';

const lambda = new AWS.Lambda();

sendEmailButton.addEventListener("click", () => {

  if (pageName == 'suggestions.html') {
    var feedbackType = dropbtn.innerHTML + ": "
    var feedbackType = feedbackType.replace(/\r?\n|\r/g, '');
  } else {
    var feedbackType = ""
  }


  var subject = questionBox.value.trim().replace(/\r?\n|\r/g, '').replace(/"/g, "‟").replace(/"/g, '⁄').replace(/\\/g, '＼');

  var body = commentsBox.value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');

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
    } else {
      console.log('Response from Lambda:', data.Payload);
    }
  });
  alert("Message Sent")
  window.location = '/'
});