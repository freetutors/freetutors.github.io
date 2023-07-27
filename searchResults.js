import config from "./config.js"
const apiUrlget = config.apiUrlget;
const questionsList = document.querySelector(".questions_list")

const urlParams = new URLSearchParams(window.location.search)

function getTimeDifference(timestamp) {
    const currentTime = new Date();
    const previousTime = new Date(timestamp);
    const timeDiff = currentTime.getTime() - previousTime.getTime();

    // Calculate time differences in seconds, minutes, hours, days, and weeks
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
    }
var query = urlParams.get('query');

async function getAllQuestions() {
  const questions = [];
    const subjectQuestionList = await getQuestionListSubject("all");
    for (const question of subjectQuestionList) {
      questions.push(question);
    }
  return questions;
  }

async function getQuestionListSubject(subject) {
  const url = new URL(`${apiUrlget}?subject=${subject}`);
  const questionList = await fetch(url, {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
  return questionList.questionList;
}

const subjects = [
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

(async () => {
  const questions = await getAllQuestions();

    const client = new MeiliSearch({
        host: config.searchHost,
        apiKey: config.searchKey,
    });

  const index = client.index('questionListIndex')
  await index.addDocuments(questions)
  const search = await index.search(query);

  for (const hit of search.hits.reverse()) {
    for (const question of questions) {
      if (question.questionId == hit.id) {
        questionsList.innerHTML +=
          `<div class="box text_box">
             <img id="text_box_pfp" src="${"placeholder_pfp.png"}">
             <div id="text_box_question_content">${question.title}</div>
             <div id="asked_by_line">asked by ${question.author}, ${getTimeDifference(question.timestamp)}</div>
             <div id="answered_by_line">Be the first to answer!</div>
             <div class="question_stats">
             <div id="question_stats_items">${question.answers} Answers</div>
             <div id="question_stats_items">${question.views} views</div>
             <div id="question_stats_items">${question.rating} rating</div>
          </div>`
      }
    }
  }
})();


