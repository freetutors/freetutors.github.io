// 
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

var path = window.location.pathname;

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
const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser") //getting username
const user = await getUserCognito(username) //getting user info with previous username
const submit = document.getElementById("tutor-send");
const email = "          Account Email:" + user.UserAttributes[4].Value //letting us know ur email
const functionName = 'sendEmail';

const lambda = new AWS.Lambda();

submit.addEventListener("click", () => {

  var subject = "New Tutor!!!"; //subject of email
    const phone = "Phone:" + document.getElementById("phone-number").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const subjects = "          Strong Subjects:" +  document.getElementById("subjects").value.trim().replace(/\r?<br>|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const classes =  "        Classes:" +  document.getElementById("classes").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const school = "        School:" + document.getElementById("school").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const grade = "        Grade:" + document.getElementById("grade").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    const info = "        Info:"+ document.getElementById("info").value.trim().replace(/\r?\n|\r/g, ' ').replace(/"/g, "‟").replace(/"/g, ' ⁄').replace(/\\/g, '＼');
    var body = phone + subjects + classes + school + grade + email + info //all of the info from the html with any wierd characters cut
    const payload = {
    "body": "{\"subject\": \"" + subject + "\", \"body\": \"" + body + "\"}" //data being sent to lambda
  };
  const params = {
    FunctionName: functionName,
    Payload: JSON.stringify(payload), //initalizing data for lambda
  };

  lambda.invoke(params, (err, data) => { //calling function
    if (err) {
      console.error('Error calling the Lambda function:', err);
    } else {
      console.log('Response from Lambda:', data.Payload);
    }
  });
  alert("Application Sent")
  window.location = '/'
});