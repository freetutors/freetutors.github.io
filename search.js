import config from './config.js'
const apiUrlget = config.apiUrlget;
const possibleSearchResultContainer = document.querySelector('.possibleSearchResultContainer')
const possibleSearchResult = document.querySelector('.possibleSearchResult')

async function getAllQuestions() {
  const questions = [];
  for (const subject of subjects) {
    const subjectQuestionList = await getQuestionListSubject(subject);
    for (const question of subjectQuestionList) {
      questions.push({id: question.questionId, title: question.title});
    }
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

(async () => {
    const questions = await getAllQuestions();

    const client = new MeiliSearch({
        host: 'http://13.52.102.170',
        apiKey: 'ZWE3ZGM2YmFmN2JkMjU0ZTBhZWViY2Jm',
    });

    async function performLiveSearch(inputValue) {
      const search = await index.search(inputValue);
      possibleSearchResultContainer.innerHTML = ''
      for (const searchResult of search.hits.reverse().slice(0, 5)) {
        possibleSearchResultContainer.innerHTML +=
        `
          <div class="possibleSearchResult">${searchResult.title}</div>
        `
      }
    }

    const index = client.index('questionIndex')
    let response = await index.addDocuments(questions)

    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', (event) => {
        performLiveSearch(event.target.value);
    });

})();

document.addEventListener('click', function(e) {
  var clickedElement = (e.target || e.srcElement)
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