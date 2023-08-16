import config from "./config.js";
//sending email to lamda and then to owners
var path = window.location.pathname;
var pageName = path.split("/").pop();

const questionBox = document.querySelector(".question_box")
const commentsBox = document.querySelector(".comments_box")
var dropbtn = document.querySelector(".dropbtn");

AWS.config.update({
  region: 'us-west-1',
  credentials: new AWS.Credentials(config.accessKey, config.secretKey),
});

const sendEmailButton = document.querySelector(".buttons");

const functionName = 'sendEmail';

const lambda = new AWS.Lambda();
const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")

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

sendEmailButton.addEventListener("click", () => {
  if (username == null){
    if(window.confirm("Please Log In to Contact Us"));{
      window.location = "/login"
    }
  }
  else{
    if (pageName == 'suggestions.html') {
      var feedbackType = dropbtn.innerHTML + ": "
      var feedbackType = feedbackType.replace(/\r?\n|\r/g, '');
    } else {
      var feedbackType = ""
    }
  
  
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
      } else {
        console.log('Response from Lambda:', data.Payload);
      }
    });
    alert("Suggestion Sent")
    window.location = '/'
  }

});