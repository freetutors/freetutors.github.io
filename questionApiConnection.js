//Creating question to database. Waiting on how yash inputs values

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'link', 'image'], // Customize the toolbar elements here
  // Additional toolbar options...
];
if (window.location == "createQuestion.html") {
  var quill = new Quill('#editor', {
    placeholder: 'Provide any additional relevant details',
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions,
      imageResize: {
        modules: ['Resize']
      },
      imageDrop: true,
    },
  });
  
  document.querySelector(".question-send").addEventListener("click", () => {
    submitQuestion()
  })
}

const apiUrlcreate = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/create";
const apiUrlget = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/getquestion";
const health = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/health";

async function submitQuestion() {
  const title = document.getElementById('title').value;
    const body = quill.root.innerHTML;
    const author = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");  
    const response = await fetch(apiUrlcreate, {
      mode: 'cors',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title:title,
        body: body,
        author: author,
      })
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.log("Error calling API");
    }
  
}

//getting for home page
var views = "0" //depending on what column it is on, it will get the questions
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

async function getQuestionList(views) {
  const url = new URL(`${apiUrlget}?views=${views}`);
  const questionList = await fetch(url,  {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
  console.log(questionList)
  return questionList.questionList
}

async function showQuestionColumn(){
  var views = "0"
  const questionList = await getQuestionList(views)
  console.log(questionList)
  const questionArray = questionList
  console.log(questionArray)
  questionArray.forEach(question => {
    var title = question.title
    var author = question.author
    var answers = question.answers
    var rating = question.rating
    var timeAgo = getTimeDifference(question.timestamp)
    var views = question.views
    
    document.querySelector(".questions_list").innerHTML += 
      `<div class="box text_box">
      <!-- pfp -->
      <img id="text_box_pfp" src="placeholder_pfp.png">
      <div id="text_box_question_content">${title}</div>
      <div id="asked_by_line">asked by ${author}, ${timeAgo}</div>
      <div id="answered_by_line">answered by abraham_lincoln27, asdfghjkl;, yoyoman, and 2 others</div>
      <div class="question_stats">
        <div id="question_stats_items">${answers} Answers</div>
        <div id="question_stats_items">${views} views</div>
        <div id="question_stats_items">${rating} rating</div>
      </div>`
    }
  )
}

if (window.location == "index.html" || "/") {
  showQuestionColumn()
}

