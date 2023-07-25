import config from "./config.js";

var path = window.location.pathname;
var pageName = path.split("/").pop();

const poolId =config.poolId //getting info from cognito
const clientId = config.clientId
const region = config.region
const accessKey = config.accessKey
const secretKey = config.secretKey
AWS.config.region = region; //telling what region to search
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ //COnnecting to pool
  IdentityPoolId: poolId 
});

AWS.config.update({
  region: 'us-west-1',
  credentials: new AWS.Credentials(config.accessKey, config.secretKey),
});
var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy


async function getUserCognito(username) {
    try {
      const params = {
        UserPoolId: poolId,
        Username: username
      };
  
      const user = await cognito.adminGetUser(params).promise();
      console.log(user)
      return user;
    } catch (error) {
        alert("error:"+error+"Please log out and log in again")
    }
  }
const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")
const user = await getUserCognito(username)
const submit = document.getElementById("tutor-send");
const email = "Account Email:" + user.UserAttributes[4].Value
const functionName = 'sendEmail';

const lambda = new AWS.Lambda();

submit.addEventListener("click", () => {

  var subject = "New Tutor!!!";
    const phone = "Phone:" + document.getElementById("phone-number").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const subjects = "          Strong Subjects:" +  document.getElementById("subjects").value.trim().replace(/\r?<br>|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const classes =  "        Classes:" +  document.getElementById("classes").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const school = "        School:" + document.getElementById("school").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const grade = "        Grade:" + document.getElementById("grade").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const info = "        Info:"+ document.getElementById("info").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    var body = phone + subjects + classes + school + grade + email + info
    const payload = {
    "body": "{\"subject\": \"" + subject + "\", \"body\": \"" + body + "\"}"
  };
  console.log(payload)
  const params = {
    FunctionName: functionName,
    Payload: JSON.stringify(payload),
  };
  console.log(params)

  lambda.invoke(params, (err, data) => {
    console.log("got to here")
    if (err) {
      console.error('Error calling the Lambda function:', err);
    } else {
      console.log('Response from Lambda:', data.Payload);
    }
  });
  alert("Application Sent")
  window.location = '/'
});