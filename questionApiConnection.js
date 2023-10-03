import config from "./config.js";
//Creating question to database. Waiting on how yash inputs values
const apiUrlcreate = config.apiUrlcreate
const apiUrlget = config.apiUrlget;
const apiUrlupdate = config.apiUrlupdate;
const apiUrlanswer = config.apiUrlanswer;
const apiUrlanswerUpdate = config.apiUrlanswerUpdate;
const apiUrlgetUser = config.apiUrlgetUser;
const apiUrlupdateUser = config.apiUrlupdateUser
const apiUrlupdateUserAnswer = config.apiUrlupdateUserAnswer
const apiUrlupdateUserRating = config.apiUrlupdateUserRating

// Import the necessary AWS SDK components
const poolId =config.poolId //getting info from cognito
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
let theme
const browserTheme = localStorage.getItem('theme')
if (browserTheme=='light'){
  theme = 'snow'
}
else{
  theme = 'snow'
}
var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy

async function getUser(username){ //pulls user from database with details
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
    const isVerified = user.UserStatus === 'CONFIRMED';
    return isVerified;
  } catch (error) {
    console.error('Error checking user verification:', error.message, error.stack);
    return false;
  }
}
async function updateQuestionRatingWithUser(questionId, user, rating){
  const url = new URL(`${apiUrlupdateUserRating}?questionId=${questionId}&user=${user}&rating${rating}`);
  const response = await fetch(url,  {
      mode: "cors",
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      }
  }).then(response => response.json());
}
var toolbarOptions = [ //setting quill toolbar options and settings
  ['bold', 'italic', 'underline', 'link', 'image'], // Customize the toolbar elements here
  // Additional toolbar options...
];
if (window.location.pathname.indexOf("createQuestion") !== -1) { //if on the create question page

  var quill = new Quill('#editor', { //creates a new quill editor for user
    placeholder: 'Provide any additional relevant details',
    theme: theme,
    modules: {
      toolbar: toolbarOptions,
      imageResize: {
        modules: ['Resize']
      },
      imageDrop: true,
    },
  });
  function updatePreviewBody() { //updates for latex
    var content = quill.root.innerHTML;
    console.log(content)
    previewContainer.innerHTML = content;
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, previewContainer]);
  }
  quill.on('text-change', function () {
    updatePreviewBody();
  });
  document.querySelector(".question-send").addEventListener("click", () => { //when submit is clicked
    //cognito info is stored on local storage(ei. last auth user and tokens)
    var userId = localStorage.getItem(`CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser`)
    if (checkCookieExists("createCooldown") == false){
      if (userId !== null){
        checkUserVerification(userId) //this is an async functino so that is why.then is needed
        .then(isVerified => { //function returns a boolean for verified or not
          if (isVerified) {
            submitQuestion() //submits to database
            addUserQuestions(userId) //updates user stats
            alert("Question Submitted!")
            //this is creating a 100 second cooldown from creating questions to fix a overwriting bug
            var currentTime = new Date();
            var expirationTime = new Date(currentTime.getTime() + 300000); // 100000 milliseconds = 100seconds
            // Convert the expiration time to the appropriate format for cookies
            var expirationString = expirationTime.toUTCString();
            document.cookie = "createCooldown=NopeYouGottaAwait; expires=" + expirationString + "; path=/";
            setTimeout(function() { //3 sceond delay for lag
              window.location="/"
            }, 500);
          } else {
            if(window.confirm("Please verify your account to post a question"));{
              window.location = "/verification" //sends to verificatino if not verified
            }
          }
        });
    }
    else{
      if(window.confirm("Please login to post a question"));{
        window.location = "/login" //sends to verificatino if not verified
      }
    }
    }
  else{
    alert("Please wait 5 minutes before posting another question.")
  }
  })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
  console.log(answers)
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
    const user = await getUser("humbalumba")
    const pfp = ""//user.user[0].pfp
    var subject =  document.querySelector(".dropbtn").textContent.toLocaleLowerCase();
    if (subject.indexOf("select") !== -1){
      subject= 'other'
    }
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
        subject: subject,
        pfp: pfp
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

async function displayQuestion(){ //displays on view question.html

  var pfpsToGet = []
  var iconsToGet = []
  const urlParams = new URLSearchParams(window.location.search); //info for each unique question is sent in the acutal url
  const questionId = urlParams.get('questionId');
  const questionList = await getQuestionListId(questionId) //pulls question
  const questionArray = questionList
  for(const question of questionArray) {
    // const users = [question.author, question.answersInfo.map(answer => answer.author)]
    // console.log(users)
    var title = question.title
    let body = question.body
    var author = question.author
    console.log(author)
    if (!pfpsToGet.includes(author)) {
      pfpsToGet.push(author);
    }
    const user = await getUser(author)
    author = author.replace(/\./g,"")
    console.log(author)
    var answerInfo = question.answersInfo
    var answers = question.answers
    var rating = question.rating
    var date = formatDate(question.timestamp)

    document.getElementById("question-wrapper").innerHTML = //filling info in html class global_pfp squarifies image
    `
    <div class="title">${title}</div>
    <hr class="titleSep">
    <div class="question">
      <div class="pfpRow">
      <img id = "pfp" src="/placeholder_pfp.png" class="global_pfp pfp${author}" onclick="window.location = 'profile?username=${user.user[0].username}'">
      <div class="contributorStats">
        <div class ="title-box title${author}">
          <p class="username" onclick="window.location='/profile?username=${author}'">${author}</p>
        </div>
        <p class="time">${date}</p>
      </div>
      </div>
      <p class = "questionBody">${body}</p>
      <div class="rating-container">
        <div class="upvote vote"></div>
        <div class="rating-value">${rating}</div>
        <div id = "help" class="vote downvote"></div>
      </div>
    </div>
    `
    document.querySelector(".answer-wrapper").innerHTML = "" //filling in answers
    if (answerInfo != null){ //wont run upon no answers

      for(const answer of answerInfo) {  //pulling info from each answer
        var abody = answer.body
        var author = answer.author
        var unformattedAuthor = answer.author
        var answerId = answer.answerId
        var rating = answer.rating
        var time = formatDate(answer.timestamp) //formating date
        if (!pfpsToGet.includes(author)) {
          pfpsToGet.push(author);
        }
        author = author.replace(/\./g,"")
        document.querySelector(".answer-wrapper").insertAdjacentHTML(
          "beforeend",
          `
          <div class="answer">
          <div class ="pfpRow">
          <img src="/placeholder_pfp.png" class="global_pfp pfp${author}" onclick="window.location = 'profile?username=${unformattedAuthor}'">
          <div class="contributorStats">
          <div class ="title-box title${author}">
            <p class="username" onclick="window.location='/profile?username=${unformattedAuthor}'">${author}</p>
            <img class="${user.user[0].status}-icon" src="Blank.svg" alt="Verified Tutor" width="25px" height="25px"></img>
          </div>
            <p class="time">${time}</p>
          </div>
          </div>
          <p class="answerBody">${abody}</p>
          <div class="rating-container">
            <div class="upvote" id="upvote${answerId}"></div>
            <div class="rating-value" id = "rating-value${answerId}">${rating}</div>
            <div class="downvote" id="downvote${answerId}"></div>
          </div>
        </div>
        <hr class="questionSep">
          `
        )
        answerRating(answer, questionId)
      }
    }
  }


  while (typeof MathJax == 'undefined') {
      await sleep(10)
    }

  MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'question-wrapper']); //latex addition
  MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'answer-wrapper']);

  if (window.location.pathname.indexOf("/viewQuestion") !== -1){ //if view question.html
    MathJax.Hub.Config({ //intializing latex + mathjax{used for latex}
      tex2jax: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [],
        processEscapes: true,
      },
      skipStartupTypeset: true, // Skip automatic typesetting on startup
    });
  }
  var updatedViews = 0
  if (checkCookieExists(questionId) == false) { //checking cookies for views and updating
    setCookie(questionId)
    updatedViews= questionList[0].views+1
    var newRating = parseInt(questionList[0].rating)
    var answers= questionList[0].answers
    sendUpdate(questionId, answers, updatedViews, newRating) //sending update for cookies
  }
  else{
  }
  if (!isQuillInitialized) {
    var quill = initializeQuill();
    isQuillInitialized = true;
  }
  if (!isQuillInitialized) {
    var quill = initializeQuill();
    isQuillInitialized = true;
  }
  answerArea(questionList, quill)
  for (const i in pfpsToGet){ //everything that requires us to get user from database is at the end for optimization
    const author = pfpsToGet[i] //for every user on the page it will replace pfp and icon if needed
    const user = await getUser(author) //pulling here
    const pfp = user.user[0].pfp //getting pfp
    
    let displayedImage//setting empty global(in function) variable
    if (pfp == null){ //if author has no pfp it will give a defaul
    displayedImage = "placeholder_pfp.png"
    }
    else{
    displayedImage = `data:image/png;base64,${pfp}`
    }
    const formattedAuthor = author.replace(/\./g, "")
    const images = document.querySelectorAll(`.pfp${formattedAuthor}`) //pulling all pfps for the selected user
    images.forEach(image => { //for each it will replace image
      image.src = displayedImage;
    });
    let icon //global(in function variable)changing based on if someone is a tutor or not
    if (user.user[0].status =="tutor"){
      icon = "trace.svg"
    }
    else if (user.user[0].status =="staff"){
      icon = "image2vector.svg"
    }
    else { //if no status then no icon
      icon = "Blank.svg"
    }
    const iconUsers = document.querySelectorAll(`.title${formattedAuthor}`)//for everyone who needs an icon
    iconUsers.forEach(title => {
      title.innerHTML = 
      `
      <p class="username" onclick="window.location='/profile?username=${author}'">${author}</p>
      <img class="${user.user[0].status}-icon" src="${icon}" alt="Verified Tutor" width="25px" height="25px"></img>
      `
    })

  }  await ratingButtons(questionList)

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
    let answers = parseInt(questionList[0].answers) +1
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
  console.log(answers)
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
      document.getElementById("upvote"+answerId).style.borderBottom = '15px solid var(--secondary-color)'
    }
    else if(getCookie("voted"+answerId) === 'downvote') {
      downclick = true
      upclick = false
      document.getElementById("downvote"+answerId).style.borderTop = '15px solid var(--secondary-color)'
    }
  }
  window.addEventListener('beforeunload', function (event) {
    sendUpdate(questionId, answers, updatedViews, newRating)
    localStorage.setItem("test","yes")
  });
  return new Promise((resolve) => { //code for updating live, sending cookies and update
    document.getElementById("upvote"+answerId).addEventListener("click", event => { //if upvote clicked
      if (localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser") != null){ //signup check
          if (upclick == false && downclick == false) { //if no votes then plus one
            document.getElementById("upvote"+answerId).style.borderBottom = '15px solid var(--secondary-color)'
            upclick = true
            ratingUpdate = 1
            newRating += parseInt(ratingUpdate)
            updateAnswer(questionId, answerId, newRating)
            setCookie("voted"+answerId, "upvote", 365)
            document.getElementById(`rating-value${answerId}`).innerText = newRating
          }
          else if(upclick==true){ //if cancling upvote
            console.log('ca')
            document.getElementById("upvote"+answerId).style.borderBottom = '15px solid var(--text-color)'
            ratingUpdate = -1
            upclick = false
            newRating += parseInt(ratingUpdate)
            updateAnswer(questionId, answerId, newRating)
            setCookie("voted"+answerId, "no", 365)
            document.getElementById(`rating-value${answerId}`).innerText = newRating
          }
          else if(downclick==true){ //if cancling upvote
            document.getElementById("upvote"+answerId).style.borderBottom = '15px solid var(--secondary-color)'
            document.getElementById("downvote"+answerId).style.borderTop = '15px solid var(--text-color)'
            ratingUpdate = 2
            upclick = true
            downclick = false
            newRating += parseInt(ratingUpdate)
            updateAnswer(questionId, answerId, newRating)
            setCookie("voted"+answerId, "upvote", 365)
            document.getElementById(`rating-value${answerId}`).innerText = newRating
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
          document.getElementById("downvote"+answerId).style.borderTop = '15px solid var(--secondary-color)'
          downclick = true
          ratingUpdate = -1
        newRating += parseInt(ratingUpdate)
        updateAnswer(questionId, answerId, newRating)
        setCookie("voted"+answerId, "downvote", 365)
        document.getElementById(`rating-value${answerId}`).innerText = newRating

      }
        else if(downclick == true && upclick == false) {
          document.getElementById("downvote"+answerId).style.borderTop = '15px solid var(--text-color)'
          ratingUpdate = 1
          downclick = false
          newRating += parseInt(ratingUpdate)
          updateAnswer(questionId, answerId, newRating)
          setCookie("voted"+answerId, "no", 365)
          document.getElementById(`rating-value${answerId}`).innerText = newRating
        }
        else if(upclick==true){ //if cancling upvote
          document.getElementById("upvote"+answerId).style.borderBottom = '15px solid var(--text-color)'
          document.getElementById("downvote"+answerId).style.borderTop = '15px solid var(--secondary-color)'
          ratingUpdate = -2
          upclick = false
          downclick = true
          newRating += parseInt(ratingUpdate)
          updateAnswer(questionId, answerId, newRating)
          setCookie("voted"+answerId, "downvote", 365)
          document.getElementById(`rating-value${answerId}`).innerText = newRating
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
  const user = localStorage.getItem('CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser')
  var question = await getQuestionListId(questionId)
  const userRatings = question[0].userRatings
  const existingRatingIndex = userRatings.findIndex(
    (entry) => entry.user === user
  );
  if (existingRatingIndex !== -1) {
    console.log()
    setCookie("voted"+questionId, userRatings[existingRatingIndex].ratingValue, 365)

  } else {
    setCookie("voted"+questionId, 'aaa', 0)
  }
  if (checkCookieExists("voted"+questionId)==false){
    upclick = false
    downclick = false
  }
  else{
    if (getCookie("voted"+questionId) === 'no') {
      upclick = false
      downclick = false
      deleteCookie("voted"+questionId);
    }
    else if(getCookie("voted"+questionId)=== 'upvote') {
      upclick = true
      downclick = false
      document.querySelector(".upvote").style.borderBottom = '15px solid var(--secondary-color)'
    }
    else if(getCookie("voted"+questionId) === 'downvote') {
      downclick = true
      upclick = false
      document.querySelector(".downvote").style.borderTop = '15px solid var(--secondary-color)'
    }
  }
  return new Promise((resolve) => {
    document.querySelector(".downvote").addEventListener("click", function() {
      if (localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser") != null){
        if (upclick == false && downclick == false) {
          document.querySelector(".downvote").style.borderTop = '15px solid var(--secondary-color)'
          downclick = true
          ratingUpdate = -1
        newRating += parseInt(ratingUpdate)
        sendUpdate(questionId, answers, updatedViews, newRating)
        setCookie("voted"+questionId, "downvote", 365)
        updateQuestionRatingWithUser(questionId,user,"downvote")
        document.querySelector(".rating-value").innerText = newRating
        }
        else if(downclick == true && upclick == false) {
          document.querySelector(".downvote").style.borderTop = '15px solid var(--text-color)'
          ratingUpdate = 1
          downclick = false
          newRating += parseInt(ratingUpdate)
          sendUpdate(questionId, answers, updatedViews, newRating)
          setCookie("voted"+questionId, "no", 365)
          updateQuestionRatingWithUser(questionId,user,"no")
          document.querySelector(".rating-value").innerText = newRating
        }
        else if(upclick==true){ //if cancling upvote
          document.querySelector(".upvote").style.borderBottom = '15px solid var(--text-color)'
          document.querySelector(".downvote").style.borderTop = '15px solid var(--secondary-color)'
          ratingUpdate = -2
          downclick = true
          upclick = false
          newRating += parseInt(ratingUpdate)
          sendUpdate(questionId, answers, updatedViews, newRating)
          setCookie("voted"+questionId, "downvote", 365)
          updateQuestionRatingWithUser(questionId,user,"downvote")
          document.querySelector(".rating-value").innerText = newRating
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
            document.querySelector(".upvote").style.borderBottom = '15px solid var(--secondary-color)'
            upclick = true
            ratingUpdate = 1
            newRating += parseInt(ratingUpdate)
            sendUpdate(questionId, answers, updatedViews, newRating)
            setCookie("voted"+questionId, "upvote", 365)
            updateQuestionRatingWithUser(questionId,user,"upvote")
            document.querySelector(".rating-value").innerText = newRating
          }
          else if (upclick == true && downclick == false) {
            document.querySelector(".upvote").style.borderBottom = '15px solid var(--text-color)'
            ratingUpdate = -1
            upclick = false
            newRating += parseInt(ratingUpdate)
            sendUpdate(questionId, answers, updatedViews, newRating)
            setCookie("voted"+questionId, "no", 365)
            updateQuestionRatingWithUser(questionId,user,"no")
            document.querySelector(".rating-value").innerText = newRating
          }
          else if(downclick==true){ //if cancling downvote
            document.querySelector(".downvote").style.borderTop = '15px solid var(--text-color)'
            document.querySelector(".upvote").style.borderBottom = '15px solid var(--secondary-color)'
            ratingUpdate = 2
            downclick = false
            upclick=true
            newRating += parseInt(ratingUpdate)
            sendUpdate(questionId, answers, updatedViews, newRating)
            setCookie("voted"+questionId, "upvote", 365)
            updateQuestionRatingWithUser(questionId,user,"upvote")
            document.querySelector(".rating-value").innerText = newRating
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
function initializeQuill() {
  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'link', 'image'],
    // Additional toolbar options...
  ];

  var quill = new Quill('#editor', {
    placeholder: 'Type your answer here',
    theme: theme,
    modules: {
      toolbar: toolbarOptions,
      imageDrop: true,
      imageResize: {
        modules: ['Resize'],
      },
    },
  });

  // Listen to the editor's content-change event
  quill.on('text-change', function () {
    checkImageSize(quill);
  });

  return quill;
}

function checkImageSize(quill) {
  const limitWidth = 720; // Maximum width
  const limitHeight = 720; // Maximum height

  const editor = quill.editor;
  const images = /*editor.container.querySelectorAll('img');*/[]

  images.forEach((img) => {
    const width = img.width;
    const height = img.height;

    if (width > limitWidth || height > limitHeight) {
      // If the image exceeds the size limit, resize it
      if (width > limitWidth) {
        img.width = limitWidth;
        img.height = (height * limitWidth) / width;
      }
      if (height > limitHeight) {
        img.height = limitHeight;
        img.width = (width * limitHeight) / height;
      }
    }
  });
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
function deleteCookie(cookieName) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
if (window.location.pathname.indexOf("/viewQuestion") !== -1) {
  displayQuestion().then(() => {
    // window.addEventListener('unload', function (event) {
    //   // sendUpdate(questionId, answers, updatedViews, newRating);
    //   localStorage.setItem("test", "yes");
    // });
  });
}
else if (window.location.pathname === "/freetutors.github.io/createQuestion.html" || window.location.href ==="/createQuestion.html") {
}