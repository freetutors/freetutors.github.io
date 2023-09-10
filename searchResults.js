import config from "./config.js"
const apiUrlget = config.apiUrlget;
const questionsList = document.querySelector(".questions_list")
const apiUrlgetUser = config.apiUrlgetUser;

AWS.config.update({
  region: config.region,
  accessKeyId: config.accessKet,
  secretAccessKey: config.secretKey,
});

document.addEventListener('click', function(e) {
  var clickedElement = (e.target)
  if (clickedElement.className == "box text_box") {
    const id = clickedElement.getAttribute('alt')
    window.location = `viewQuestion?questionId=${id}`;
  }
}, false);

const urlParams = new URLSearchParams(window.location.search)
async function getUser(username){ //getting user info from dynamo
  const url = new URL(`${apiUrlgetUser}?username=${username}`);
  const user = await fetch(url,  {
      mode: "cors",
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      },
  }).then(response => response.json());
  return user
}
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

(async () => {
    const client = new MeiliSearch({
        host: config.searchHost,
        apiKey: config.searchKey,
    });

  const index = client.index('questionListIndex3')
  const search = await index.search(query);

  let idList = []
  for (const id of search.hits) {
    idList.push(id.id)
  }

  const dynamodb = new AWS.DynamoDB.DocumentClient();

  var table = "Freetutor-Question";

  const tableName = 'Freetutor-Question';
  const itemIds = idList;
  const params = {
    RequestItems: {
      [tableName]: {
        Keys: itemIds.map(questionId => ({ questionId })),
      },
    },
  };

  dynamodb.batchGet(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err,
                  null, 2));
      } else {
          const items = data.Responses[tableName].map(item => item);

          items.sort((a, b) => {
            const indexA = idList.indexOf(a.questionId);
            const indexB = idList.indexOf(b.questionId);

            return indexA - indexB;
          });

          placeQuestionBoxes(items)
          
      }
  });
async function placeQuestionBoxes(items) {
  for (const question of items) {
    const user = await getUser(question.author)
    const pfp = user.user[0].pfp
    var displayedImage = ""
        if (pfp == null){ //getting pfp, if pfp is none it will user default
          displayedImage = "placeholder_pfp.png"
        }
        else{
          displayedImage = `data:image/png;base64,${pfp}`
        }
        if (!question.answersInfo){
          var answers = 0

      }else{
          var answers = question.answersInfo.length
      }
      var author = question.author
      var unformattedAuthor = question.author      
      author = author.replace(/\./g,"")
      if (answers != 0){
        questionsList.innerHTML += //sending html info
        `<div class="box text_box">
        <!-- pfp -->
        <img id="global_pfp" class = "pfp${author}" src="${displayedImage}" alt="user_pfp" onclick="window.location='/profile?username=${unformattedAuthor}'">
        <div id="text_box_question_content" onclick="window.location = '/viewQuestion?questionId=${question.questionId}'">${question.title}</div>
        <div id="asked_by_line">asked by <a href="https://www.freetutors.net/profile?username=${unformattedAuthor}">${author}, ${getTimeDifference(question.timestamp)}</a></div>
        <div id="answered_by_line">Add to the conversation!</div>
        <div class="question_stats">
          <div id="question_stats_items">${answers} Answers</div>
          <div id="question_stats_items">${question.views} views</div>
          <div id="question_stats_items">${question.rating} rating</div>
        </div>`
          }
          else{
              questionsList.innerHTML += //sending html info
              `<div class="box text_box">
      <!-- pfp -->
      <img id="global_pfp" class = "pfp${author}" src="${displayedImage}" alt="user_pfp" onclick="window.location='/profile?username=${unformattedAuthor}'">
      <div id="text_box_question_content" onclick="window.location = '/viewQuestion?questionId=${question.questionId}&title=${title}'">${question.title}</div>
      <div id="asked_by_line">asked by <a href="https://www.freetutors.net/profile?username=${unformattedAuthor}">${author}, ${getTimeDifference(question.timestamp)}</a></div>
      <div id="answered_by_line">Be the first to answer!</div>
      <div class="question_stats">
        <div id="question_stats_items">${answers} Answers</div>
        <div id="question_stats_items">${question.views} views</div>
        <div id="question_stats_items">${question.rating} rating</div>
      </div>`
      }

        // questionsList.innerHTML +=
        //   `<div class="box text_box" alt="${question.questionId}">
        //      <img id="text_box_pfp" src="${displayedImage}">
        //      <div id="text_box_question_content">${question.title}</div>
        //      <div id="asked_by_line">asked by ${question.author}, ${getTimeDifference(question.timestamp)}</div>
        //      <div id="answered_by_line">Be the first to answer!</div>
        //      <div class="question_stats">
        //      <div id="question_stats_items">${answers} Answers</div>
        //      <div id="question_stats_items">${question.views} views</div>
        //      <div id="question_stats_items">${question.rating} rating</div>
        //   </div>`
          console.log(question)
          console.log(question.answerInfo)
  }
}


})();



