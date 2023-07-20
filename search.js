//Creating question to database. Waiting on how yash inputs values
const apiUrlcreate = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/create";
const apiUrlget = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/getquestion";
const health = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/health";
const apiUrlupdate = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/updatequestion";
const apiUrlanswer = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/createanswer";
const apiUrlanswerUpdate = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/updateanswer";
const apiUrlgetUser = "https://d487bezzog.execute-api.us-west-1.amazonaws.com/beta/get"
// Import the necessary AWS SDK components
const poolId ='us-west-1_w3se6DxlL' //getting info from cognito
const clientId ='lact4vt8ge7lfjvjetu1d3sl7'
const region = 'us-west-1'
const accessKey = "AKIAS6EY4GUSOJWYQPUN"
const secretKey = "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"

async function getQuestionListId(questionId) {
  const url = new URL(`${apiUrlget}?questionId=${questionId}`);
  console.log(url);
  const questionList = await fetch(url,  {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
  return questionList.questionList
}

async function displayQuestion(){
  const urlParams = new URLSearchParams(window.location.search);
  const questionId = urlParams.get('questionId');
  const questionList = await getQuestionListId(questionId);
  const questionArray = questionList;
  console.log(questionArray)
  for(const question of questionArray) {
    var title = question.title;
    console.log(title);
  }
}

displayQuestion();

