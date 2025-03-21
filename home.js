// Import configuration from external file
// import config from "./config.js";
//manually importing config data because ios errors from importing from js =(
let data
async function getOptimizeConfig() {
    try {
        const response = await fetch('./optimize.json');
        const json = await response.json();
        data = processJSONData(json);

    } catch (error) {
      console.log(error);
    }
    return data;
}
function processJSONData(data) {
    var data = {
        apiUrlcreate : data.apiUrlcreate,
        apiUrlget  : data.apiUrlget,
        health  : data.health,
        apiUrlupdate  : data.apiUrlupdate,
        apiUrlanswer  : data.apiUrlanswer,
        apiUrlanswerUpdate  : data.apiUrlanswerUpdate,
        apiUrlgetUser  : data.apiUrlgetUser,
        apiUrlupdateUserRating: data.apiUrlupdateUserRating,
        apiUrlupdateAnswerRating: data.apiUrlupdateAnswerRating,
        // Import the necessary AWS SDK components
        poolId  : data.poolId, //getting info from cognito
        clientId  :data.clientId,
        region  : data.region,
        accessKey  : data.accessKey,
        secretKey  : data.secretKey,
    
        apiUrlCreateUser: data.apiUrlCreateUser,
        apiUrlupdateUser: data.apiUrlupdateUser,
        apiUrlupdateUserAnswer: data.apiUrlupdateUserAnswer,
    
        searchHost: data.searchHost,
        searchKey: data.searchKey
    }
    return data
}
var range=[0]
let old
for (const i in range){
    old = await getOptimizeConfig()
}
var config = old
const qotwId = 'bcbb4292-68a9-90f3-a129-9a40e6994471' //put the id of the weekly question
// Extract API URLs from configuration
const apiUrlget = config.apiUrlget;
const apiUrlgetUser = config.apiUrlgetUser;
const poolId =config.poolId //getting info from cognito
const region = config.region
const accessKey = config.accessKey
const secretKey = config.secretKey
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
while (typeof AWS == 'undefined') {
    await sleep(10)
}
AWS.config.region = region; //telling what region to search
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({ //COnnecting to pool
    IdentityPoolId: poolId
  });

  AWS.config.update({ //getting conection to IAM user
    region: region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey
  });

  var cognito  = new AWS.CognitoIdentityServiceProvider();


// Select relevant DOM elements
const questionBoxContainer = document.querySelector(".questions_list");
const questionHeader = document.querySelector('.question_header');

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
// Fetch question list for a given subject
async function getQuestionList(subject) {
    const url = new URL(`${apiUrlget}?subject=${subject}`);
    const response = await fetch(url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data.questionList;
}
async function getQuestionListViews(views) {
    const url = new URL(`${apiUrlget}?views=${views}`);
    const response = await fetch(url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data.questionList;
}
// Fetch user information using username
async function getUser(username) {
    const url = new URL(`${apiUrlgetUser}?username=${username}`);
    const response = await fetch(url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data;
}

// Calculate time difference in human-readable format
function getTimeDifference(timestamp) {
    const currentTime = Date.now();
    const previousTime = new Date(timestamp).getTime();
    const timeDiff = currentTime - previousTime;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (weeks > 0) {
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

function addQuestionClickListeners(questionList) {
    questionBoxContainer.addEventListener("click", function(event) {
        const box = event.target.closest(".box.text_box");
        if (!box) return;

        const index = Array.from(questionBoxContainer.children).indexOf(box);
        if (event.target.id === "global_pfp") {
            const questionAuthor = questionList[index].author;
            openProfile(questionAuthor);
        } else if (event.target.id === "text_box_question_content") {
            const questionId = questionList[index].questionId;
            localStorage.setItem("QuestionID", JSON.stringify(questionId));
            window.location = `viewQuestion?questionId=${questionId}`;
        }
    });
}
async function topQuestions(){
    var qotw = await getQuestionListId(qotwId) //question of the week = qotw
    qotw = qotw[0]
    console.log(qotw)
    let answers
    if (qotw.answersInfo){
        answers = qotw.answersInfo.length
    }else{
        answers=0
    }
    document.querySelector(".qotw_box").addEventListener("click", () => {
        window.location = `/viewQuestion?questionId=${qotwId}`
    })
    document.querySelector(".qotw_box").innerHTML = //making top question the qotw
    `  <div class="qotw-title">Question of the Week</div>
    <h3 class="qotw-content">${qotw.title}</h3>
    <p class = "qotw-info" >Answers: ${answers}</p>
    <p class = "qotw-info">Views: ${qotw.views}</p>
    <p class = "qotw-info">Rating: ${qotw.rating}</p>`
    const questions = await getQuestionListViews("top") //getting all questions
    questions.sort((a, b) => b.views - a.views); //getting top five views b/c bakcend cant do this for some reason
    const top5Questions = questions.slice(0, 5);
    for (const i in top5Questions){
        const question = questions[i] //for each question it'll add to the section
        document.querySelector(".top-questions-box").innerHTML += 
            `
            <div class = "top-question"  onclick = "window.location = '/viewQuestion?questionId=${question.questionId}&title=${question.title}'">
            <p class="tp-title">${question.title}</p>
            <p class="tp-info">${question.answers} Answers &#8226 ${question.views} Views &#8226 ${question.rating} Rating </p>
          </div>`
        
    }
}
function showQuestionColumn(subject) {
    (async () => {
        // const questionList = await getQuestionList(subject);
        document.querySelector(".questions_list").innerHTML = ''
        const questionList = await getQuestionList(subject)
        const questionArray = questionList
        var pfpsToGet = []
        for (const question of questionArray) {
            var title = question.title //getting question data
            var unformattedAuthor = question.author
            var author = question.author
            console.log(question)
            if (!question.answersInfo){
                var answers = 0
            }else if (question.answersInfo[0].length !== null){ // fixes a bug after just posting a question
                if (question.answersInfo[0].author == "Robo-Tutor" && question.answersInfo.length == 1){ //if robo-tutor is the only answer it will count as 0
                    var answers = 0
                } else{
                    var answers = question.answersInfo.length
                }
            } else{
                var answers = 0
            }
            var rating = question.rating
            var timeAgo = ", " + getTimeDifference(question.timestamp)
            var views = question.views
            if (window.innerWidth <= 800){
                timeAgo = ""
            }
            // var user = await getUser(author)
            // var pfp = user.user[0].pfp
            // var displayedImage = ""
            // if (pfp == null) { //getting pfp, if pfp is none it will user default
            //     displayedImage = "placeholder_pfp.png"
            // } else {
            //     displayedImage = `data:image/png;base64,${pfp}`
            // }
            if (!pfpsToGet.includes(author)) {
                pfpsToGet.push(author);
            }
            author = author.replace(/\./g,"")
            if (answers != 0){
                document.querySelector(".questions_list").innerHTML += //sending html info
                `<div class="box text_box" id = "${question.questionId}">
        <!-- pfp -->
        <img id="global_pfp" class = "pfp${author}" src="/placeholder_pfp.png" alt="user_pfp" onclick="window.location='/profile?username=${unformattedAuthor}'">
        <div class="question-title-column">
            <div id="text_box_question_content">${title}</div>
            <div id="asked_by_line"><a href="https://www.freetutors.net/profile?username=${unformattedAuthor}">asked by ${author}${timeAgo}</a></div>
            <div id="answered_by_line">Add to the conversation!</div>
        </div>
        <div class="question_stats">
          <div id="question_stats_items">${answers} Answers</div>
          <div id="question_stats_items">${views} Views</div>
          <div id="question_stats_items">${rating} Rating</div>
        </div>`
            }
            else{
                document.querySelector(".questions_list").innerHTML += //sending html info
                `<div class="box text_box"  id = "${question.questionId}">
        <!-- pfp -->
        <img id="global_pfp" class = "pfp${author}" src="/placeholder_pfp.png" alt="user_pfp" onclick="window.location='/profile?username=${unformattedAuthor}'">
        <div class="question-title-column">
            <div id="text_box_question_content">${title}</div>
            <div id="asked_by_line"><a href="https://www.freetutors.net/profile?username=${unformattedAuthor}">asked by ${author}${timeAgo}</a></div>
            <div id="answered_by_line">Be the first to answer!</div>     
        </div>    
        <div class="question_stats">
          <div id="question_stats_items">${answers} Answers</div>
          <div id="question_stats_items">${views} Views</div>
          <div id="question_stats_items">${rating} Rating</div>
        </div>`
        }
        if (window.innerWidth <= 800){ //if mobile then get the element
            const questionElement = document.getElementById(question.questionId)
            const stats = questionElement.querySelector(".question_stats")
            const profilePic = questionElement.querySelector("#global_pfp")
            const boxHeight = questionElement.getBoundingClientRect().height
            console.log(profilePic)
            if (boxHeight == 145){
                stats.style.marginTop = '-105px'
                profilePic.style.transform = 'translateY(7.5px)' 
            }
            else if (boxHeight == 130){
                stats.style.marginTop = '-97.5px'
                profilePic.style.transform = 'translateY(2.5px)' 
                questionElement.querySelector("#answered_by_line").style.marginTop = '25px'
            }
            else if (boxHeight == 166){
                stats.style.marginTop = '-115px'
                profilePic.style.transform = 'translateY(17.5px)' 
            }
            var textElement = document.querySelector('#text_box_question_content');
            var maxLength = 53;

            if (textElement.textContent.length > maxLength) {
                textElement.textContent = textElement.textContent.substring(0, maxLength) + '...';
            }
        }
        }
        const questionBoxes = document.querySelectorAll("#text_box_question_content");
        questionBoxes.forEach((box, index) => { //when click will go to view Question.html
            box.addEventListener("click", function() {
                console.log('a')
                const questionId = questionList[index].questionId; // Retrieve the questionId
                localStorage.setItem("QuestionID", JSON.stringify(questionId));
                window.location = `viewQuestion?questionId=${questionId}&title=${title}`;
            });

        });
        
        for (const i in pfpsToGet){
            var author = pfpsToGet[i]
            const user = await getUser(author)
            const pfp = user.user[0].pfp
            var displayedImage = ""
            author = author.replace(/\./g, "")
            if (pfp == null){ //if author has no pfp it will give a defaul
                displayedImage = "placeholder_pfp.png"
            }
            else{
                displayedImage = `data:image/png;base64,${pfp}`
            }
            const images = document.querySelectorAll(`.pfp${author}`)
            images.forEach(image => {
                image.src = displayedImage;
            });
        }
        isEventListenerActive = true;
    })();
}
try{
    showQuestionColumn("math");
} catch (error){
    console.error("An error occurred:", error.message); // Logs the error to the console
    alert("An error occurred: " + error.message); 
}


function openProfile(username) {
    window.location = `profile?username=${username}`;
}

const headerSubjects = [ //list of subjects, we can always add more
    "Math",
    "Chemistry",
    "Biology",
    "Physics",
    "English",
    "History",
    "Geography",
    "Foreign Language",
    "Computer Science",
    "Other"
];

const subjectList = document.querySelector('.subject-list');
const scrollLeftButton = document.querySelector('#arrow-left');
const scrollRightButton = document.querySelector('#arrow-right');
let active = "Math"

// Populate subject list
for (const subject of headerSubjects) {
    const formattedSubject = subject.replace(" ", "");
    subjectList.innerHTML += `<li class="subject" id="subject${formattedSubject}">${subject}</li>`;
}

let isEventListenerActive = true;

document.querySelector('.subject-list').addEventListener("click", function(e) {
    if (!isEventListenerActive) {
        return; // Ignore clicks if the flag is set to false
    }

    // Disable the event listener while the code is executing
    isEventListenerActive = false;

    e = e || window.event;
    var target = e.target || e.srcElement,
        subject = target.textContent || target.innerText;

    if (headerSubjects.includes(subject)) {
      showQuestionColumn(subject.toLowerCase());
      document.querySelector(`#subject${active}`).classList.remove("active")
      active = subject.replace(' ', '')
      document.querySelector(`#subject${active}`).classList.add("active")
    } else {
      return "hi"
    }
});

document.querySelector(`#subjectMath`).classList.add('active')
const scrollStep = 200; //variables for smooth scrolling
const scrollDuration = 300;

// Scroll left
scrollLeftButton.addEventListener('click', () => {
    scrollToSmoothly(subjectList, subjectList.scrollLeft - scrollStep, scrollDuration);
});

// Scroll right
scrollRightButton.addEventListener('click', () => {
    scrollToSmoothly(subjectList, subjectList.scrollLeft + scrollStep, scrollDuration);
});

function scrollToSmoothly(element, to, duration) { //code for making the arrows scroll smoothly
    const start = element.scrollLeft;
    const change = to - start;
    const startTime = performance.now();

    function animateScroll(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutQuad(progress);
        element.scrollLeft = start + change * easedProgress;

        if (elapsed < duration) {
            requestAnimationFrame(animateScroll);
        }
    }
    requestAnimationFrame(animateScroll);
}

// Easing function for smoother scrolling animation
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}
const signUpTutor = document.querySelector('#tutorSignUp')
const localUser = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")

if (localUser !== null) {
    const user = await getUser(localUser)
    const status = user.user[0].status
    if (status !== "tutor" && status !== "staff") {
        signUpTutor.innerHTML +=
            `
    <button id="sign_up_as_tutor_button" onclick="window.location='tutorSignUp'">Sign up as tutor</button>
  `
    }
} else {

  signUpTutor.innerHTML +=
      `
        <button id="sign_up_as_tutor_button" >Sign up as tutor</button>
      `;
    document.querySelector("#sign_up_as_tutor_button").addEventListener('click', () => {
        alert("Log In to Sign Up as A Tutor")
    })
}



(async () => {
    const listUserParams = { //getting total users from cognito
        UserPoolId: poolId,
        AttributesToGet: []
    }
    var numUsers = 0

    while (typeof cognito == 'undefined') {
      await sleep(10)
    }
    setTimeout(() => {
    cognito.listUsers(listUserParams, (err,data) =>{ //async function to get list of all users
    if (err) {
        console.error('Error listing users:', err);
        } else {
        numUsers = data.Users.length; //sets global variable for num of users
        }
}) 
    }, 300);

    const totalQuestions = await getQuestionList("all") //pulling all users(all subject)
    const numQuestions = totalQuestions.length
    var numAnswers = 0
    for (const question of totalQuestions) {
        var answers = 0
        if (question.answersInfo) {
            answers = question.answersInfo.length
        }
        numAnswers = numAnswers + answers
    }



    async function animate(valToAnimate, container, gear) {
        const strVal = String(valToAnimate);
        const numDigits = strVal.length;
        const digWheel = container.getElementsByClassName(gear);

        container.innerHTML = '';

        for (let i = 0; i < numDigits; i++) {
            container.innerHTML += `
        <div class=${gear}>
          <div class="dig">0</div>
          <div class="dig">1</div>
          <div class="dig">2</div>
          <div class="dig">3</div>
          <div class="dig">4</div>
          <div class="dig">5</div>
          <div class="dig">6</div>
          <div class="dig">7</div>
          <div class="dig">8</div>
          <div class="dig">9</div>
        </div>
      `;
        }

        await sleep(15);

        for (let i = 0; i < numDigits; i++) {
            digWheel[i].style.transform = 'translateY(-' + String(30 * strVal[i]) + 'px)';
        }
    }

    while (numUsers == 0) {
      await sleep(10)
    }
    // animate(numQuestions, document.querySelector(".important_box_num1"), 'important_box_num1_digit')
    // animate(numAnswers, document.querySelector(".important_box_num2"), 'important_box_num2_digit')
    // animate(numUsers, document.querySelector(".important_box_num3"), 'important_box_num3_digit')

})();
await topQuestions()

