apiUrlget  = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/getquestion"

async function getAllQuestions() {
  allQuestionsList = [];
  for (const subject of subjects) {
    subjectQuestionList = await getQuestionListSubject(subject);
    for (const question of subjectQuestionList) {
      allQuestionsList.push(question.title)
    }
  }

  return allQuestionsList
}

async function showQuestionColumn(subject){
    const questionList = await getQuestionListSubject(subject)
}

async function getQuestionListSubject(subject) {
    const url = new URL(`${apiUrlget}?subject=${subject}`);
    const questionList = await fetch(url,  {
        mode: "cors",
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    }).then(response => response.json());
    return questionList.questionList
}

const subjects = [ //htmlSection
    "chemistry",
    "biology",
    "physics",
    "english",
    "history",
    "geography",
    "foreign language",
    "computer science",
    "physical education",
    "math",
  ];

