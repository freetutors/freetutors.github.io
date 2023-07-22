searchResultContainer = document.querySelector(".possibleSearchResultContainer")
possibleSearchResult = document.querySelector(".possibleSearchResult")

async function getAllQuestions() {
  const questions = [];
  for (const subject of searchSubjects) {
    const subjectQuestionList = await getQuestionListSubject(subject);
    for (const question of subjectQuestionList) {
      questions.push({id: question.questionId, title: question.title});
    }
  }
  return questions;
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

const searchSubjects = [
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
    /*searchResultContainer.innerHTML = ''*/
    const questions = await getAllQuestions();

    const client = new MeiliSearch({
        host: 'http://127.0.0.1:7700',
        apiKey: 'kQE9SvunfTVx7NsGiqpq1NKRip-HKkGof55F0WOt77k',
    });

    const index = client.index('questions')

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
        `<div class="possibleSearchResult">${hit.title}</div>`
      }
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
    performLiveSearch(event.target.value);
  });

})();

searchBar.addEventListener('focus', () => {
  // Set the display property of the search result container to 'none'
  searchResultContainer.style.display = 'block';
});

// Add an event listener for the blur event on the search bar
searchBar.addEventListener('blur', () => {
  // Set the display property of the search result container back to its original value
  searchResultContainer.style.display = 'none'; // Or 'initial', 'flex', etc., depending on its original display value
});






