import config from "./config.js";

const apiUrlcreate = config.apiUrlcreate;
const apiUrlget = config.apiUrlget;
const apiUrlupdate = config.apiUrlupdate;
const apiUrlanswer = config.apiUrlanswer;
const apiUrlanswerUpdate = config.apiUrlanswerUpdate;
const apiUrlgetUser = config.apiUrlgetUser;
const apiUrlupdateUser = config.apiUrlupdateUser;
const apiUrlupdateUserAnswer = config.apiUrlupdateUserAnswer;

const poolId = config.poolId;
const region = config.region;
const accessKey = config.accessKey;
const secretKey = config.secretKey;
AWS.config.region = region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: poolId,
});

AWS.config.update({
  region: region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});
var cognito = new AWS.CognitoIdentityServiceProvider();

async function getUser(username) {
  const url = new URL(`${apiUrlgetUser}?username=${username}`);
  const user = await fetch(url, {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
  return user;
}

async function checkUserVerification(userId) {
  try {
    const params = {
      UserPoolId: poolId,
      Username: userId,
    };

    const user = await cognito.adminGetUser(params).promise();
    const isVerified = user.UserStatus === 'CONFIRMED';
    return isVerified;
  } catch (error) {
    console.error('Error checking user verification:', error.message, error.stack);
    return false;
  }
}

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'link', 'image'],
];

if (window.location.pathname.indexOf("createQuestion") !== -1) {
  var quill = new Quill('#editor', {
    placeholder: 'Provide any additional relevant details',
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions,
      imageResize: {
        modules: ['Resize'],
      },
      imageDrop: true,
    },
  });

  function updatePreviewBody() { //updates for latex
    var content = quill.root.innerHTML;
    previewContainer.innerHTML = content;
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, previewContainer]);
  }
  quill.on('text-change', function () {
    updatePreviewBody();
  });
  document.querySelector(".question-send").addEventListener("click", () => { //when submit is clicked
    //cognito info is stored on local storage(ei. last auth user and tokens)
    var userId = localStorage.getItem(`CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser`)
    if (userId !== null){
      checkUserVerification(userId) //this is an async functino so that is why.then is needed
      .then(isVerified => { //function returns a boolean for verified or not
        if (isVerified) {
          submitQuestion() //submits to database
          addUserQuestions(userId) //updates user stats
          alert("Question Submitted!")
          setTimeout(function() { //3 sceond delay for lag
            window.location="/"
          }, 3000);
        } else {
          if(window.confirm("Please verify your account to answer a question"));{
            window.location = "/verification.html" //sends to verificatino if not verified
          }
        }
      });
  }
  })
}

async function addUserQuestions(username){ //updating user questions stat
  const user = await getUser(username) //pulls user with 
  const questions = parseInt(user.user[0].questions) + 1 //adding questions
  const url = new URL(`${apiUrlupdateUser}`) //sending call
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
async function addUserAnswers(username){ //updating user answers stat, same as above
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
}
async function submitQuestion() { //sends questions to database
    const title = document.getElementById('title').value; //pulling data values
    const body = quill.root.innerHTML;
    const author = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");  
    const subject =  document.querySelector(".dropbtn").textContent.toLocaleLowerCase();
    const response = await fetch(apiUrlcreate, { //sending api call
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
    } else {
      alert("Error adding question, try again later")
      console.log("Error calling API");
    }
}
async function getQuestionListId(questionId) { //pulls question by id
  const url = new URL(`${apiUrlget}?questionId=${questionId}`); //sending info through the url because a get call does not support body
  const questionList = await fetch(url,  {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
  return questionList.questionList
}
function formatDate(timestamp) { //turning the saved timestamp into a month, date, year format
  const date = new Date(timestamp);
  let formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return formattedDate
}
var isQuillInitialized = false; //this is making sure there is no duplicate quill sections on the page upon rating

async function displayQuestion() {
  const urlParams = new URLSearchParams(window.location.search);
  const questionId = urlParams.get('questionId');
  const questionList = await getQuestionListId(questionId);

  // Get all the answers for the given question
  const answerInfo = questionList[0].answersInfo || [];

  const questionArray = questionList;
  for (const question of questionArray) {
    var title = question.title;
    let body = question.body.replace(/<p>/g, "").replace(/<\/p>/g, " ");
    var author = question.author;
    var answers = question.answers;
    var rating = question.rating;
    var date = formatDate(question.timestamp);
    const user = await getUser(author);
    let icon;
    if (user.user[0].status == "tutor") {
      icon = "trace.svg";
    } else if (user.user[0].status == "staff") {
      icon = "image2vector.svg";
    } else {
      icon = "Blank.svg";
    }
    const pfp = user.user[0].pfp;
    var displayedImage = "";
    if (pfp == null) {
      displayedImage = "placeholder_pfp.png";
    } else {
      displayedImage = `data:image/png;base64,${pfp}`;
    }
    document.getElementById("question-wrapper").innerHTML =
      `
    <div class="title">${title}</div>
    <hr class="titleSep">
    <div class="question">
      <img id="pfp" src=${displayedImage} class="global_pfp" onclick="window.location = 'profile?username=${user.user[0].username}'">
      <div class="contributorStats">
        <div class="title-box">
          <p class="username">${author}</p>
          <img class="${user.user[0].status}-icon" src="${icon}" alt="Verified Tutor" width="25px" height="25px"></img>
        </div>
        <p class="time">${date}</p>
      </div>
      <p class="questionBody">${body}</p>
      <div class="rating-container">
        <div class="upvote vote"></div>
        <div class="rating-value">${rating}</div>
        <div id="help" class="vote downvote"></div>
      </div>
    </div>
    `;
  }

  // Fetch all the answers in parallel
  const answerPromises = answerInfo.map(async (answer) => {
    const user = await getUser(answer.author);
    const pfp = user.user[0].pfp;
    const displayedImage = pfp ? `data:image/png;base64,${pfp}` : "placeholder_pfp.png";
    const abody = answer.body.replace(/<p>/g, "").replace(/<\/p>/g, " ");
    let icon;
    if (user.user[0].status == "tutor") {
      icon = "trace.svg";
    } else if (user.user[0].status == "staff") {
      icon = "image2vector.svg";
    } else {
      icon = "Blank.svg";
    }
    const time = formatDate(answer.timestamp);

    return `
      <div class="answer">
        <img src=${displayedImage} class="global_pfp" onclick="window.location = 'profile?username=${answer.author}'">
        <div class="contributorStats">
          <div class="title-box">
            <p class="username">${answer.author}</p>
            <img class="${user.user[0].status}-icon" src="${icon}" alt="Verified Tutor" width="25px" height="25px"></img>
          </div>
          <p class="time">${time}</p>
        </div>
        <p class="answerBody">${abody}</p>
        <div class="rating-container">
          <div class="upvote" id="upvote${answer.answerId}"></div>
          <div class="rating-value" id="rating-value${answer.answerId}">${answer.rating}</div>
          <div class="downvote" id="downvote${answer.answerId}"></div>
        </div>
      </div>
    `;
  });

  // Wait for all the answers to be fetched
  const answersHtml = await Promise.all(answerPromises);

  // Display all the answers together
  document.querySelector(".answer-wrapper").innerHTML = answersHtml.join("");

  MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'question-wrapper']); //latex addition
  MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'answer-wrapper']);

  if (window.location.pathname == "/freetutors.github.io/viewQuestion.html") { //if view question.html
    MathJax.Hub.Config({ //intializing latex + mathjax{used for latex}
      tex2jax: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [],
        processEscapes: true,
      },
      skipStartupTypeset: true, // Skip automatic typesetting on startup
    });
  }

  var updatedViews = 0;
  if (checkCookieExists(questionId) == false) { //checking cookies for views and updating
    setCookie(questionId);
    updatedViews = questionList[0].views + 1;
    var newRating = parseInt(questionList[0].rating);
    var answers = questionList[0].answers;
    sendUpdate(questionId, answers, updatedViews, newRating); //sending update for cookies
  }
}

async function answerArea(questionList, quill){

  var previewContainer = document.getElementById('preview-container');

  function updatePreviewBody() { //more quill stuff
    var content = quill.root.innerHTML;
    previewContainer.innerHTML = content;
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, previewContainer]);
  }

  quill.on('text-change', function () {
    updatePreviewBody();
  });
  document.getElementById("answer-send").addEventListener("click", function() { //when answer send clicked
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
    if (username !== null){
      checkUserVerification(username)
      .then(isVerified => { //checking if user is veriified
        if (isVerified) {
          addUserAnswers(username) //adding stats
          sendAnswer(questionId, body, author) // sending new answer to database
          sendUpdate(questionId, answers, views, rating) //updating question stats
          setTimeout(function() { //lag proof
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
      displayQuestion() //will ignore info and reset page
    }
  })
}

async function sendAnswer(questionId, body, author) { //sending answer to database
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

async function sendUpdate(questionId, answers, updatedViews, rating){ //updating question stats
  const url = new URL(`${apiUrlupdate}?questionId=${questionId}&answers=${answers}&views=${updatedViews}&rating=${rating}`);
  const response = await fetch(url,  {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",

    },
  }).then(response => response.json());
}

async function updateAnswer(questionId, answerId, rating){ //updating when answer is rated
  console.log(apiUrlanswerUpdate)
  const url = new URL(`${apiUrlanswerUpdate}?questionId=${questionId}&answerId=${answerId}&rating=${rating}`)
  const response = await fetch(url,  {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
}
async function answerRating(answer, questionId){ //rating function
  var answerId = answer.answerId
  var newRating = parseInt(answer.rating)
  let upclick = false
  let downclick = false
  let ratingUpdate = 0
  if (checkCookieExists("voted"+answerId)==false){ //checking if previously voted
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
  return new Promise((resolve) => { //code for updating live, sending cookies and update
    document.getElementById("upvote"+answerId).addEventListener("click", event => { //if upvote clicked
      if (localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser") != null){ //signup check
          if (upclick == false && downclick == false) { //if no votes then plus one
            document.getElementById("upvote"+answerId).style.borderBottom = '15px solid green'
            upclick = true
            ratingUpdate = 1
            newRating += parseInt(ratingUpdate)
            updateAnswer(questionId, answerId, newRating)
            setCookie("voted"+answerId, "upvote", 365)
          document.querySelector(".answer-wrapper").innerHTML = 
          ``
          setTimeout(function(){
            displayQuestion()  //lag proofing
          },2000)
          }
          else{ //if cancling upvote
            document.getElementById("upvote"+answerId).style.borderBottom = '15px solid white'
            ratingUpdate -= 1
            upclick = false
            newRating += parseInt(ratingUpdate)
            updateAnswer(questionId, answerId, newRating)
            setCookie("voted"+answerId, "no", 365)
            document.querySelector(".answer-wrapper").innerHTML = 
            ``
            setTimeout(function(){
              displayQuestion()  
            },2000)
          }
        resolve(ratingUpdate)
        }
        else { 
          alert("Please log in to leave a rating.")
        }
     }) 

     document.getElementById("downvote"+answerId).addEventListener("click", function() { //if downvote, following same logic as above
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
        setTimeout(function(){
          displayQuestion()  
        },2000)
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
          setTimeout(function(){
            displayQuestion()  
          },2000)  
        }
        resolve(ratingUpdate)
      }
      else {
        alert("Please log in to leave a rating.")
      }
    })
  })
}
async function ratingButtons(questionList){ //same as above, but updates question instead
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
        setTimeout(function(){
          displayQuestion()  
        },1000)
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
            setTimeout(function(){
              displayQuestion()  
            },1000)
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
            setTimeout(function(){
              displayQuestion()  
            },1000)
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
function checkCookieExists(cookieName) { //checking cookie
  return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(`${cookieName}=`));
}
// Function to set a cookie with a given name and value
function setCookie(cookieName, cookieValue, expirationDays) { //creating cookie
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
function initializeQuill(){ //setting quill(used sometimes for quill not always)
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
//setting calls for different pages
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