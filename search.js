import config from './config.js'
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
// async function getAllQuestions() {
//   const questions = [];
//   for (const subject of subjects) {
//     const subjectQuestionList = await getQuestionListSubject(subject);
//     console.log("1")
//     for (const question of subjectQuestionList) {
//       questions.push(question);
//     }
//   }
//   console.log("2")
//   return questions;
// }
//old function so you can test speed diff

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
        host: searchHost,
        apiKey: searchKey,
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

    const index = client.index('questionListIndex')
    let response = await index.addDocuments(questions)

    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', (event) => {
        performLiveSearch(event.target.value);
    });

})();

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

/*

chmod 400 meilisearchKeyPair.pem
ssh -i meilisearchKeyPair.pem admin@54.183.227.34
ssh -i meilisearchKeyPair.pem -L 7700:127.0.0.1:7700 ec2-user@54.183.227.34

http://54.183.227.34

https://54.183.227.34.nip.io

54.183.227.34.nip.io {
    reverse_proxy localhost:8000
}

54.183.227.34.nip.io {
    reverse_proxy localhost:8000
}

 sudo lsof -i :80

sudo nano /etc/caddy/Caddyfile

*/