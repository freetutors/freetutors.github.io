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
const email = user.UserAttributes[4].Value
const functionName = 'sendEmail';

const lambda = new AWS.Lambda();

submit.addEventListener("click", () => {

  var subject = "New Tutor!!!";
    const phone = document.getElementById("phone-number").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const subjects = document.getElementById("subjects").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const classes = document.getElementById("classes").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const school = document.getElementById("school").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const grade = document.getElementById("grade").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const info = document.getElementById("info").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    var body = "Phone:" + phone + "\n" + "Strong Subjects:" + subjects + "\n" + "Classes:" + classes + "\n" + "School:" + school + "\n" + "Grade:" + grade + "/n"+ "Account Email:" + email + "/n"+"/n"+"Info:"+info
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