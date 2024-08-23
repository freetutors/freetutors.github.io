// import config from './config.js'

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

const apiUrlget = config.apiUrlget;
const searchHost = config.searchHost
const searchKey = config.searchKey
const possibleSearchResultContainer = document.querySelector('.possibleSearchResultContainer')
async function getAllQuestions() {
  const questions = [];
    const subjectQuestionList = await getQuestionListSubject("all");
    for (const question of subjectQuestionList) {
      questions.push({id: question.questionId, title: question.title});
    }
  return questions;
}

function handleSearchTrigger() {
  window.location = 'search.html?query=' + searchBar.value.trim()
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

const searchBar = document.querySelector('.search-bar');

(async () => {
    const questions = await getAllQuestions();

    const client = new MeiliSearch({
        host: searchHost,
        apiKey: searchKey,
    });

    async function performLiveSearch(inputValue) {
      const search = await index.search(inputValue);
      /*const docToRemove = await index.search("test")
      let response = await index.deleteDocument(docToRemove)
      console.log(response)*/
      possibleSearchResultContainer.innerHTML = ''
      for (const searchResult of search.hits.slice(0, 5)) {
        possibleSearchResultContainer.innerHTML +=
        `
          <div class="possibleSearchResult">${searchResult.title}</div>
        `
      }
    }



    const index = client.index('questionListIndex3')
    let response = await index.updateDocuments(questions)

    searchBar.addEventListener('input', (event) => {
        performLiveSearch(event.target.value);
    });

})();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('click', function(e) {
  var clickedElement = (e.target)
  if ((clickedElement.className !== 'search-bar') && (clickedElement.className !== 'possibleSearchResult')) {
    possibleSearchResultContainer.style.display = "none";
  } else if (clickedElement.className == 'possibleSearchResult') {
    searchBar.value = clickedElement.innerHTML
    window.location = 'search.html?query=' + searchBar.value.trim()
  }
}, false);

searchBar.addEventListener('focus', () => {
      possibleSearchResultContainer.style.display = "block";
});

searchBar.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
    handleSearchTrigger()
  }
});