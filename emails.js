import config from "./config.js";

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
  alert("Suggestion Sent")
  window.location = '/'
});