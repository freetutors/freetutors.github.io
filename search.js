<<<<<<< Updated upstream
searchResultContainer = document.querySelector(".possibleSearchResultContainer")
possibleSearchResult = document.querySelector(".possibleSearchResult")

apiUrlget  = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/getquestion"

async function getAllQuestions() {
  const questions = [];
  for (const subject of searchSubjects) {
=======
const apiUrlget = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/getquestion";

async function getAllQuestions() {
  const questions = [];
  for (const subject of subjects) {
>>>>>>> Stashed changes
    const subjectQuestionList = await getQuestionListSubject(subject);
    for (const question of subjectQuestionList) {
      questions.push({id: question.questionId, title: question.title});
    }
  }
  return questions;
}

async function getQuestionListSubject(subject) {
<<<<<<< Updated upstream
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

function handleSearchTrigger() {
  const searchQuery = searchBar.value.trim();
  const searchUrl = 'search.html?query=' + searchQuery;
  window.location.href = searchUrl;
}

function liveSearch() {
  var innerHTML = (event.target || event.srcElement).innerHTML;
  searchBar.value = innerHTML;
  handleSearchTrigger()
}

console.log(possibleSearchResult)

const searchSubjects = [
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


  const index = client.index('questionIndex')

  let response = await index.addDocuments(questions)

    async function performLiveSearch(inputValue) {
      const search = await index.search(inputValue);
      searchResultContainer.innerHTML = '';
      let liveResultsToShow;
      if (search.hits.length >= 5) {
        liveResultsToShow = search.hits.slice(0, 5);
      } else {
        liveResultsToShow = search.hits;
      }
      for (hit of liveResultsToShow) {
        searchResultContainer.innerHTML +=
          `<div class="possibleSearchResult" onclick="liveSearch()">${hit.title}</div>`
      }
    }

    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', (event) => {
    performLiveSearch(event.target.value);
  });

})();

document.addEventListener('click', function(e) {
    e = e || window.event;
    var className = (e.target || e.srcElement).className;
    if ((className !== 'search-bar') && (className !== 'possibleSearchResult')) {
     searchResultContainer.style.display = 'none';
    }

}, false);

searchBar.addEventListener('focus', () => {
  searchResultContainer.style.display = 'block';
});
/*
searchBar.addEventListener('blur', () => {

});*/
=======
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
  //htmlSection
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
        host: 'http://127.0.0.1:7700',
        apiKey: '8Gqjb5Plux9O5lB9UAjqdE_9WjCUNELR4K2WnPbOAhA',
    });

    let index = await client.getIndex('questions');

    async function performSearch(inputValue) {
      const search = await index.search(inputValue);
      console.log(search.hits);
    }

    if (!index) {
        try {
            const newIndex = await createIndex(client, indexName);
            console.log('Index created:', newIndex);
            index = client.getIndex(indexName);
        } catch (error) {
            console.error('Error creating index:', error);
        }
    }

    // Search bar input event listener
    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', (event) => {
        performSearch(event.target.value);
    });

})();
>>>>>>> Stashed changes
