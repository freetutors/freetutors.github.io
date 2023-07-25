import config from "./config.js";
//Creating question to database. Waiting on how yash inputs values
const apiUrlcreate = config.apiUrlcreate
const apiUrlget = config.apiUrlget;
const health = config.health;
const apiUrlupdate = config.apiUrlupdate;
const apiUrlanswer = config.apiUrlanswer;
const apiUrlanswerUpdate = config.apiUrlanswer;
const apiUrlgetUser = config.apiUrlgetUser;
const apiUrlupdateUser = config.apiUrlupdateUser
const apiUrlupdateUserAnswer = config.apiUrlupdateUserAnswer

// Import the necessary AWS SDK components
const poolId =config.poolId //getting info from cognito
const clientId = config.clientId
const region = config.region
const accessKey = config.accessKey
const secretKey = config.secretKey
AWS.config.region = region; //telling what region to search
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ //COnnecting to pool
  IdentityPoolId: poolId 
});

AWS.config.update({ //getting conection to IAM user
  region: region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey
});
var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy

async function getUser(username){
  const url = new URL(`${apiUrlgetUser}?username=${username}`);
  const user = await fetch(url,  {
      mode: "cors",
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      }
  }).then(response => response.json());
  return user
}
// Function to check if the user's account is verified
async function checkUserVerification(userId) {
  try {
    const params = {
      UserPoolId: poolId,
      Username: userId
    };

    const user = await cognito.adminGetUser(params).promise();
    console.log(user)
    const isVerified = user.UserStatus === 'CONFIRMED';
    console.log(isVerified)
    return isVerified;
  } catch (error) {
    console.error('Error checking user verification:', error.message, error.stack);
    return false;
  }
}
var toolbarOptions = [
  ['bold', 'italic', 'underline', 'link', 'image'], // Customize the toolbar elements here
  // Additional toolbar options...
];
if (window.location.pathname.indexOf("createQuestion") !== -1) {
  console.log("called")
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
  function updatePreviewBody() {
    var content = quill.root.innerHTML;
    previewContainer.innerHTML = content;
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, previewContainer]);
  }
  quill.on('text-change', function () {
    updatePreviewBody();
  });
  document.querySelector(".question-send").addEventListener("click", () => {
    var userId = localStorage.getItem(`CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser`)
    if (userId !== null){
      checkUserVerification(userId)
      .then(isVerified => {
        if (isVerified) {
          console.log('User account is verified');
          submitQuestion()
          addUserQuestions(userId)
          alert("Question Submitted!")
          setTimeout(function() {
            //your code to be executed after 1 second
            window.location="/"
          }, 3000);
        } else {
          if(window.confirm("Please verify your account to answer a question"));{
            window.location = "/verification.html"
          }
        }
      });
  }
  })
}

async function addUserQuestions(username){
  const user = await getUser(username)
  const questions = parseInt(user.user[0].questions) + 1
  const url = new URL(`${apiUrlupdateUser}`)
  const response = await fetch(url,  {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "username": user.user[0].username,
      "questions":questions,
    })
  }).then(response => response.json());
}
async function addUserAnswers(username){
  const user = await getUser(username)
  const answers = user.user[0].answers +1
  const url = new URL(`${apiUrlupdateUserAnswer}`)
  const response = await fetch(url,  {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "username": user.user[0].username,
      "answers": answers
    })
  }).then(response => response.json());
  console.log(response)
}
async function updateUser(username, answers, questions){
  const url = new URL(`${apiUrlupdateUser}`)
  const response = await fetch(url,  {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "username": username,
      "questions":questions,
      "answers": answers
    })
  }).then(response => response.json());
  console.log(response)
}
async function submitQuestion() {
    console.log("clicked")
    const title = document.getElementById('title').value;
    const body = quill.root.innerHTML;
    const author = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");  
    const subject =  document.querySelector(".dropbtn").textContent.toLocaleLowerCase();
    console.log(subject)
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
        subject: subject
      })
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data)
    } else {
      alert("Error adding question, try again later")
      console.log("Error calling API");
    }
}
async function getQuestionListId(questionId) {
  const url = new URL(`${apiUrlget}?questionId=${questionId}`);
  console.log(url)
  const questionList = await fetch(url,  {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
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
var isQuillInitialized = false;

async function displayQuestion(){
  const urlParams = new URLSearchParams(window.location.search);
  const questionId = urlParams.get('questionId');
  const questionList = await getQuestionListId(questionId)
  const questionArray = questionList
  for(const question of questionArray) {
    console.log(question)
    var title = question.title
    let body = question.body.replace(/<p>/g, "").replace(/<\/p>/g, " ")
    var author = question.author
    var answerInfo = question.answersInfo
    var answers = question.answers
    var rating = question.rating
    var date = formatDate(question.timestamp)
    var views = question.views
    const user = await getUser(author)
    console.log(user)
    const pfp = user.user[0].pfp
    var displayedImage = ""
    if (pfp == null){
      displayedImage = "placeholder_pfp.png"
    }
    else{
      displayedImage = `data:image/png;base64,${pfp}`
    }
    document.getElementById("question-wrapper").innerHTML =
    `
    <div class="title">${title}</div>
    <hr class="titleSep">
    <div class="question">
      <img id = "pfp" src=${displayedImage} class="global_pfp" onclick="window.location = 'profile?username=${user.user[0].username}'">
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
    document.querySelector(".answer-wrapper").innerHTML = ""
    if (answerInfo != null){

      for(const answer of answerInfo) {
        console.log(answer)
        var abody = answer.body.replace(/<p>/g, "").replace(/<\/p>/g, " ")
        var author = answer.author
        var answerId = answer.answerId
        var rating = answer.rating
        console.log(author)
        var time = formatDate(answer.timestamp)
        const user = await getUser(author)
        console.log(user)
        const pfp = user.user[0].pfp
        var displayedImage = ""
        if (pfp == null){
          displayedImage = "placeholder_pfp.png"
        }
        else{
          displayedImage = `data:image/png;base64,${pfp}`
        }
        document.querySelector(".answer-wrapper").insertAdjacentHTML(
          "beforeend",
          `
          <div class="answer">
          <img src=${displayedImage} class="global_pfp" onclick="window.location = 'profile?username=${author}'">
          <div class="contributorStats">
            <p class="username">${author}</p>
            <p class="time">${time}</p>
          </div>
          <p class="answerBody">${abody}</p>
          <div class="rating-container">
            <div class="upvote" id="upvote${answerId}"></div>
            <div class="rating-value" id = "rating-value${answerId}">${rating}</div>
            <div class="downvote" id="downvote${answerId}"></div>
          </div>
        </div>
          `
        )
        answerRating(answer, questionId)
      }
    }
  }
  MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'question-wrapper']);
  MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'answer-wrapper']);

  if (window.location.pathname == "/freetutors.github.io/viewQuestion.html") {
    MathJax.Hub.Config({
      tex2jax: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [],
        processEscapes: true,
      },
      skipStartupTypeset: true, // Skip automatic typesetting on startup
    });
  }
  var updatedViews = 0
  if (checkCookieExists(questionId) == false) {
    setCookie(questionId)
    updatedViews= questionList[0].views+1
    var newRating = parseInt(questionList[0].rating)
    var answers= questionList[0].answers
    sendUpdate(questionId, answers, updatedViews, newRating)
  }
  else{
  }
  if (!isQuillInitialized) {
    var quill = initializeQuill();
    isQuillInitialized = true;
  }
  answerArea(questionList, quill)

  await ratingButtons(questionList)

}
async function answerArea(questionList, quill){

  var previewContainer = document.getElementById('preview-container');

  function updatePreviewBody() {
    var content = quill.root.innerHTML;
    previewContainer.innerHTML = content;
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, previewContainer]);
  }

  quill.on('text-change', function () {
    updatePreviewBody();
  });
  document.getElementById("answer-send").addEventListener("click", function() {
    console.log("clicked")
    const questionId = questionList[0].questionId
    const answers = parseInt(questionList[0].answers) +1
    const views = questionList[0].views
    const rating = questionList[0].rating
    const body = quill.root.innerHTML
    const author = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")
    document.querySelector(".answer-wrapper").innerHTML = 
    ``
    quill = ""
    var username = localStorage.getItem(`CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser`)
    console.log(username)
    if (username !== null){
      checkUserVerification(username)
      .then(isVerified => {
        if (isVerified) {
          console.log('User account is verified');
          addUserAnswers(username)
          sendAnswer(questionId, body, author)
          sendUpdate(questionId, answers, views, rating)
          setTimeout(function() {
            //your code to be executed after 3 second
            location.reload()
          }, 3000);
        } else {
          if(window.confirm("Please verify your account to answer a question"));{
            window.location = "/verification.html"
          }
        }
      });
    }
    else{
      alert("Please signup with a verified account to answer question.")
      displayQuestion()
    }
  })
}

async function sendAnswer(questionId, body, author) {
  const response = await fetch(apiUrlanswer, {
    mode: 'cors',
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${(await Auth.currentSession())
      //   .getIdToken()
      //   .getJwtToken()}`
    },
    body: JSON.stringify({
      questionId: questionId,
      body: body,
      author: author,
    })
  });
}

async function sendUpdate(questionId, answers, updatedViews, rating){
  const url = new URL(`${apiUrlupdate}?questionId=${questionId}&answers=${answers}&views=${updatedViews}&rating=${rating}`);
  const response = await fetch(url,  {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",

    },
  }).then(response => response.json());
}

async function updateAnswer(questionId, answerId, rating){
  const url = new URL(`${apiUrlanswerUpdate}?questionId=${questionId}&answerId=${answerId}&rating=${rating}`)
  const response = await fetch(url,  {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
}
async function answerRating(answer, questionId){
  console.log('called')
  var answerId = answer.answerId
  console.log(answerId)
  var newRating = parseInt(answer.rating)
  let upclick = false
  let downclick = false
  let ratingUpdate = 0
  if (checkCookieExists("voted"+answerId)==false){
    setCookie("voted"+answerId, "no", 365)
  }
  else{
    if (getCookie("voted"+answerId) === 'no') {
      upclick = false
      downclick = false
    }
    else if(getCookie("voted"+answerId)=== 'upvote') {
      upclick = true
      downclick = false
      document.getElementById("upvote"+answerId).style.borderBottom = '15px solid green'
    }
    else if(getCookie("voted"+answerId) === 'downvote') {
      downclick = true
      upclick = false
      document.getElementById("downvote"+answerId).style.borderTop = '15px solid red'
    }
  }
  return new Promise((resolve) => {
    document.getElementById("upvote"+answerId).addEventListener("click", event => {
      if (localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser") != null){
          if (upclick == false && downclick == false) {
            console.log("this")
            document.getElementById("upvote"+answerId).style.borderBottom = '15px solid green'
            upclick = true
            ratingUpdate = 1
            newRating += parseInt(ratingUpdate)
            updateAnswer(questionId, answerId, newRating)
            setCookie("voted"+answerId, "upvote", 365)
          document.querySelector(".answer-wrapper").innerHTML = 
          ``
          displayQuestion()
          document.querySelector(".answer-wrapper").innerHTML = 
          ``
          displayQuestion()
          document.querySelector(".answer-wrapper").innerHTML = 
          ``      
          }
            document.getElementById("upvote"+answerId).style.borderBottom = '15px solid white'
            ratingUpdate -= 1
            upclick = false
            newRating += parseInt(ratingUpdate)
            updateAnswer(questionId, answerId, newRating)
            setCookie("voted"+answerId, "no", 365)
            document.querySelector(".answer-wrapper").innerHTML = 
            ``
            displayQuestion()
            document.querySelector(".answer-wrapper").innerHTML = 
            ``
            displayQuestion()
            document.querySelector(".answer-wrapper").innerHTML =    
            ``   
        resolve(ratingUpdate)
        }
        else {
          alert("Please log in to leave a rating.")
        }
     }) 

     document.getElementById("downvote"+answerId).addEventListener("click", function() {
      if (localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser") != null){
        if (upclick == false && downclick == false) {
          document.getElementById("downvote"+answerId).style.borderTop = '15px solid red'
          downclick = true
          ratingUpdate = -1
        newRating += parseInt(ratingUpdate)
        updateAnswer(questionId, answerId, newRating)
        setCookie("voted"+answerId, "downvote", 365)
        document.querySelector(".answer-wrapper").innerHTML = 
        ``
        displayQuestion()
        document.querySelector(".answer-wrapper").innerHTML = 
        ``
        displayQuestion()
        document.querySelector(".answer-wrapper").innerHTML =
        ``       
      }
        else if(downclick == true && upclick == false) {
          document.getElementById("downvote"+answerId).style.borderTop = '15px solid white'
          ratingUpdate += 1
          downclick = false
          newRating += parseInt(ratingUpdate)
          updateAnswer(questionId, answerId, newRating)
          setCookie("voted"+answerId, "no", 365)
          document.querySelector(".answer-wrapper").innerHTML = 
          ``
          displayQuestion()
          document.querySelector(".answer-wrapper").innerHTML = 
          ``
          displayQuestion()
          document.querySelector(".answer-wrapper").innerHTML =  
          ``     
        }
        resolve(ratingUpdate)
      }
      else {
        alert("Please log in to leave a rating.")
      }
    })
  })
}
async function ratingButtons(questionList){
  var questionId = questionList[0].questionId
  var answers= questionList[0].answers
  var updatedViews = questionList[0].views
  var newRating = parseInt(questionList[0].rating)
  let upclick = false
  let downclick = false
  let ratingUpdate = 0
  if (checkCookieExists("voted"+questionId)==false){
    setCookie("voted"+questionId, "no", 365)
  }
  else{
    if (getCookie("voted"+questionId) === 'no') {
      upclick = false
      downclick = false
    }
    else if(getCookie("voted"+questionId)=== 'upvote') {
      upclick = true
      downclick = false
      document.querySelector(".upvote").style.borderBottom = '15px solid green'
    }
    else if(getCookie("voted"+questionId) === 'downvote') {
      downclick = true
      upclick = false
      document.querySelector(".downvote").style.borderTop = '15px solid red'
    }
  }
  return new Promise((resolve) => {
    document.querySelector(".downvote").addEventListener("click", function() {
      if (localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser") != null){
        if (upclick == false && downclick == false) {
          document.querySelector(".downvote").style.borderTop = '15px solid red'
          downclick = true
          ratingUpdate = -1
        newRating += parseInt(ratingUpdate)
        sendUpdate(questionId, answers, updatedViews, newRating)
        setCookie("voted"+questionId, "downvote", 365)
        document.querySelector(".answer-wrapper").innerHTML = 
        ``
        displayQuestion()
        document.querySelector(".answer-wrapper").innerHTML = 
        ``
        displayQuestion()
        document.querySelector(".answer-wrapper").innerHTML = 
        ``
        displayQuestion() //failsafe incase update lag
        }
        else if(downclick == true && upclick == false) {
          document.querySelector(".downvote").style.borderTop = '15px solid white'
          ratingUpdate += 1
          downclick = false
          newRating += parseInt(ratingUpdate)
          sendUpdate(questionId, answers, updatedViews, newRating)
          setCookie("voted"+questionId, "no", 365)
          document.querySelector(".answer-wrapper").innerHTML = 
          ``
          displayQuestion()
          document.querySelector(".answer-wrapper").innerHTML = 
          ``  
          displayQuestion()
          document.querySelector(".answer-wrapper").innerHTML = 
          ``
          displayQuestion() //failsafe incase update lag
        }
        resolve(ratingUpdate)
      }
      else {
        alert("Please log in to leave a rating.")
      }

    })
    document.querySelector(".vote").addEventListener("click", event => {
      if (localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser") != null){
        if (event.target == document.querySelector(".upvote")){
          if (upclick == false && downclick == false) {
            document.querySelector(".upvote").style.borderBottom = '15px solid green'
            upclick = true
            ratingUpdate = 1
            newRating += parseInt(ratingUpdate)
            sendUpdate(questionId, answers, updatedViews, newRating)
            setCookie("voted"+questionId, "upvote", 365)
            document.querySelector(".answer-wrapper").innerHTML = 
            ``
            displayQuestion()
            document.querySelector(".answer-wrapper").innerHTML = 
            ``
            displayQuestion()
            document.querySelector(".answer-wrapper").innerHTML = 
            ``
            displayQuestion() //failsafe incase update lag
          }
          else if (upclick == true && downclick == false) {
            document.querySelector(".upvote").style.borderBottom = '15px solid white'
            ratingUpdate -= 1
            upclick = false
            newRating += parseInt(ratingUpdate)
            sendUpdate(questionId, answers, updatedViews, newRating)
            setCookie("voted"+questionId, "no", 365)
            document.querySelector(".answer-wrapper").innerHTML = 
            ``
            displayQuestion()
            document.querySelector(".answer-wrapper").innerHTML = 
            ``
            displayQuestion()
            document.querySelector(".answer-wrapper").innerHTML = 
            ``
            displayQuestion() //failsafe incase update lag
          }
        }
        resolve(ratingUpdate)
    }
    else {
      alert("Please log in to leave a rating.")
    }
    })
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
function getCookie(name) {
  var cookieArr = document.cookie.split(";");
  for(var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      if(name == cookiePair[0].trim()) {
          return decodeURIComponent(cookiePair[1]);
      }
  }
  return null;
}
function initializeQuill(){
  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'link', 'image'], // Customize the toolbar elements here
    // Additional toolbar options...
  ];

  var quill = new Quill('#editor', {
    placeholder: 'Type your answer here',
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions,
      imageResize: {
        modules: ['Resize']
      },
      imageDrop: true,
    },
  });
  return quill
}
// Check if the event has already occurred for the current IP address
const eventCookieName = 'eventOccurred';
const expirationDays = 365;

if (!checkCookieExists(eventCookieName)) {
  // Perform the event here

  // Set a cookie to indicate that the event has occurred for the current IP address
  setCookie(eventCookieName, 'true', expirationDays);
}
if (window.location.pathname.indexOf("/viewQuestion") !== -1) {
  await displayQuestion()
}
else if (window.location.pathname === "/freetutors.github.io/createQuestion.html" || window.location.href ==="/createQuestion.html") {
}