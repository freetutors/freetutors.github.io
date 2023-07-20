//Creating question to database. Waiting on how yash inputs values
//Creating question to database. Waiting on how yash inputs values
const apiUrlcreate = config.apiUrlcreate
const apiUrlget = config.apiUrlget;
const health = config.health;
const apiUrlupdate = config.apiUrlupdate;
const apiUrlanswer = config.apiUrlanswer;
const apiUrlanswerUpdate = config.apiUrlanswer;
const apiUrlgetUser = config.apiUrlgetUser;
// Import the necessary AWS SDK components
const poolId =config.poolId //getting info from cognito
const clientId = config.clientId
const region = config.region
const accessKey = config.accessKey
const secretKey = config.secretKey

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

