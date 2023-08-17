import config from "./config.js";

const apiUrlget = config.apiUrlget;
const apiUrlgetUser = config.apiUrlgetUser;

const questionBoxContainer = document.querySelector(".questions_list");
const questionHeader = document.querySelector('.question_header');

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

function getTimeDifference(timestamp) {
  const currentTime = Date.now();
  const previousTime = new Date(timestamp).getTime();1
  const timeDiff = currentTime - previousTime;

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

function addQuestionClickListeners(questionList) {
  questionBoxContainer.addEventListener("click", function (event) {
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

// async function getUser(username){ //getting user info from dynamo
//   const url = new URL(`${apiUrlgetUser}?username=${username}`);
//   const user = await fetch(url,  {
//       mode: "cors",
//       method: "GET",
//       headers: {
//       "Content-Type": "application/json",
//       },
//   }).then(response => response.json());
//   return user
// }
function showQuestionColumn(subject) {
  (async () => {
    // const questionList = await getQuestionList(subject);

    const questionList = await getQuestionList(subject)
    const questionArray = questionList
    document.querySelector(".questions_list").innerHTML = ''
    for (const question of questionArray) {
      var title = question.title //getting question data
      var author = question.author
      var answers = question.answers
      var rating = question.rating
      var timeAgo = getTimeDifference(question.timestamp)
      var views = question.views
      const user = await getUser(author)
      const pfp = user.user[0].pfp
      var displayedImage = ""
      if (pfp == null){ //getting pfp, if pfp is none it will user defaul
        displayedImage = "placeholder_pfp.png"
      }
      else{
        displayedImage = `data:image/png;base64,${pfp}`
      }
      document.querySelector(".questions_list").innerHTML += //sending html info
        `<div class="box text_box">
        <!-- pfp -->
        <img id="global_pfp" src="${displayedImage}">
        <div id="text_box_question_content">${title}</div>
        <div id="asked_by_line">asked by ${author}, ${timeAgo}</div>
        <div id="answered_by_line">Be the first to answer!</div>
        <div class="question_stats">
          <div id="question_stats_items">${answers} Answers</div>
          <div id="question_stats_items">${views} views</div>
          <div id="question_stats_items">${rating} rating</div>
        </div>`
      }
      const questionBoxes = document.querySelectorAll(".box.text_box");
      
      questionBoxes.forEach((box, index) => { //when click will go to view Question.html
        box.addEventListener("click", function () {
          const questionId = questionList[index].questionId; // Retrieve the questionId
          localStorage.setItem("QuestionID", JSON.stringify(questionId));
          window.location = `viewQuestion?questionId=${questionId}`;
        });
      });
    // let html = '';
    // for (const question of questionList) {
    //   const pfp = question.pfp
    //   const displayedImage = pfp == null ? "placeholder_pfp.png" : `data:image/png;base64,${pfp}`;
    //   html += `
    //     <div class="box text_box">
    //       <img id="global_pfp" src="${displayedImage}">
    //       <div id="text_box_question_content">${question.title}</div>
    //       <div id="asked_by_line">asked by ${question.author}, ${getTimeDifference(question.timestamp)}</div>
    //       <div id="answered_by_line">Be the first to answer!</div>
    //       <div class="question_stats">
    //         <div id="question_stats_items">${question.answers} Answers</div>
    //         <div id="question_stats_items">${question.views} views</div>
    //         <div id="question_stats_items">${question.rating} rating</div>
    //       </div>
    //     </div>`;
    // };

    // questionBoxContainer.innerHTML = html;
    // addQuestionClickListeners(questionList);
  })();
}

showQuestionColumn("math");

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
  "Physical Education",
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
for (const subject of headerSubjects) { //for some reason it has to be seperate or it doesn't register clicks idk bro
  const formattedSubject = subject.replace(" ", "");  
  const subjectElement = document.querySelector(`#subject${formattedSubject}`);

  subjectElement.addEventListener("click", debounce(function() {
    console.log('Click event registered for:', subject);
    document.querySelector(`#subject${active}`).classList.remove("active")
    active = formattedSubject
    document.querySelector('.questions_list').innerHTML = ''
    document.querySelector(`#subject${active}`).classList.add("active")
    showQuestionColumn(subject.toLowerCase())
  }, 200));
}
document.querySelector("#subjectComputerScience").addEventListener("click", () => {
  console.log("adflh")
})
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
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
const signUpTutor = document.querySelector('#tutorSignUp')
const localUser = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")

if (localUser !== null) {
  const user = await getUser(localUser)
  const status = user.user[0].status
  if (status !== "tutor" && status !== "staff"){
    signUpTutor.innerHTML +=
  `
    <button id="sign_up_as_tutor_button" onclick="window.location='tutorSignUp'">Sign up as tutor</button>
  `
  }
} else {
  signUpTutor.innerHTML +=
    `
      <button id="sign_up_as_tutor_button" onclick="window.location='tutorSignUp'">Sign up as tutor</button>
    `
}

(async () => {

  const totalQuestions = await getQuestionList("all")
  console.log(totalQuestions)
  const numQuestions = totalQuestions.length
  var numAnswers = 0

  for (const question of totalQuestions) {
    var answers = 0
    if (question.answersInfo) {
      answers = question.answersInfo.length
    }
    numAnswers = numAnswers + answers
  }




  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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


    animate(numQuestions, document.querySelector(".important_box_num1"), 'important_box_num1_digit')
    animate(numAnswers, document.querySelector(".important_box_num2"), 'important_box_num2_digit')
    animate(Math.round(numAnswers/5), document.querySelector(".important_box_num3"), 'important_box_num3_digit')


})();
