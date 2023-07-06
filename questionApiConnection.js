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
const apiUrlupdate = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/updatequestion";

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

async function getQuestionListViews(views) {
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
  const questionList = await getQuestionListViews(views)
  const questionArray = questionList
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
      <div id="answered_by_line">Be the first to answer!</div>
      <div class="question_stats">
        <div id="question_stats_items">${answers} Answers</div>
        <div id="question_stats_items">${views} views</div>
        <div id="question_stats_items">${rating} rating</div>
      </div>`
    })
    const questionBoxes = document.querySelectorAll(".box.text_box");
    questionBoxes.forEach((box, index) => {
      box.addEventListener("click", function () {
        console.log(questionList[index]); // Access the question from the enclosing scope
        const questionId = questionList[index].questionId; // Retrieve the questionId
        console.log(questionId);
        localStorage.setItem("QuestionID", JSON.stringify(questionId));
        window.location = `viewquestion.html?questionId=${questionId}`;
      });
    });
  };
async function getQuestionListId(questionId) {
  const url = new URL(`${apiUrlget}?questionId=${questionId}`);
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
function formatDate(timestamp) {
  const date = new Date(timestamp);
  let formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return formattedDate
}
async function displayQuestion(){
  const urlParams = new URLSearchParams(window.location.search);
  const questionId = urlParams.get('questionId');
  const questionList = await getQuestionListId(questionId)
  const questionArray = questionList
  console.log(questionArray)
  questionArray.forEach(question => {
    var title = question.title
    let body = question.body.replace("<p>", "").replace("</p>", "")
    var author = question.author
    var answers = question.answers
    var rating = question.rating
    var date = formatDate(question.timestamp)
    var views = question.views
    document.getElementById("question-wrapper").innerHTML = 
    `
    <div class="title">${title}</div>
    <hr class="titleSep">
    <div class="question">
      <img src="placeholder_pfp.png" class="user_pfp">
      <div class="contributorStats">
        <p class="username">${author}</p>
        <p class="time">${date}</p>
      </div>
      <p class = "questionBody">${body}</p>
      <div class="rating-container">
        <div class="upvote vote"></div>
        <div class="rating-value">${rating}</div>
        <div id = "help" class="vote downvote"></div>
      </div>
    </div>
    `  
  })
    const newRating = await ratingButtons()
    if (checkCookieExists("viewed") == false) {
    setCookie("viewed")
    const updatedViews= questionList[0].views+1

    console.log(updatedViews)
    const answers= questionList[0].answers
    window.addEventListener('popstate', function (event) {
      const params = {
        views: updatedViews,
        rating: newRating,
        answers: answers
      }
      sendUpdate(params)
    });
  }
  else{
    console.log("previously viewed")
  }
}
async function sendUpdate(params){
  const url = new URL(`${apiUrlupdate}?questionId=${questionId}&answers=${answers}&views=${updatedViews}&rating=${rating}`);
  const response = await fetch(url,  {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
};

async function ratingButtons(){
  let upclick = false
  let downclick = false
  let ratingUpdate = 0
  document.querySelector(".downvote").addEventListener("click", function() {
    console.log("help")
    console.log("clicked")
    if (upclick == false && downclick == false) {
      console.log("clicked")
      document.querySelector(".downvote").style.borderTop = '15px solid red'
      downclick = true
      ratingUpdate = -1
      console.log(ratingUpdate)
    }
    else if(downclick == true && upclick == false) {
      document.querySelector(".downvote").style.borderTop = '15px solid white'
      ratingUpdate = 0
      downclick = false
      console.log(ratingUpdate)
    }
  })

    document.querySelector(".vote").addEventListener("click", event => {
      console.log("clicked")
      console.log(downclick, upclick)
      if (event.target == document.querySelector(".upvote")){
        if (upclick == false && downclick == false) {
          document.querySelector(".upvote").style.borderBottom = '15px solid green'
          upclick = true
          ratingUpdate = 1
          console.log(ratingUpdate)
        }
        else if (upclick == true && downclick == false) {
          document.querySelector(".upvote").style.borderBottom = '15px solid white'
          ratingUpdate = 0
          upclick = false
          console.log(ratingUpdate)
        }
      }
      else if (event.target == document.querySelector(".downvote")){

      }
    })

  }
//cookies for views and rating
function checkCookieExists(cookieName) {
  return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(`${cookieName}=`));
}

// Function to set a cookie with a given name and value
function setCookie(cookieName, cookieValue, expirationDays) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);

  const cookie = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookie;
}

// Check if the event has already occurred for the current IP address
const eventCookieName = 'eventOccurred';
const expirationDays = 365;

if (!checkCookieExists(eventCookieName)) {
  // Perform the event here
  
  // Set a cookie to indicate that the event has occurred for the current IP address
  setCookie(eventCookieName, 'true', expirationDays);
}
console.log(window.location.pathname)
if (window.location.pathname == "/freetutors.github.io/viewquestion.html") {
  console.log("Called")
  await displayQuestion()


}
else if (window.location.pathname == "/freetutors.github.io/index.html" || "/freetutors.github.io/") {
  console.log("????")
  await showQuestionColumn()
}

