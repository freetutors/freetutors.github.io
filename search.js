const apiUrlget = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/getquestion";

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
