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


function showQuestionColumn(subject) {
  (async () => {
    const questionList = await getQuestionList(subject);

    let html = '';
    for (const question of questionList) {
      const pfp = question.pfp
      const displayedImage = pfp == null ? "placeholder_pfp.png" : `data:image/png;base64,${pfp}`;
      html += `
        <div class="box text_box">
          <img id="global_pfp" src="${displayedImage}">
          <div id="text_box_question_content">${question.title}</div>
          <div id="asked_by_line">asked by ${question.author}, ${getTimeDifference(question.timestamp)}</div>
          <div id="answered_by_line">Be the first to answer!</div>
          <div class="question_stats">
            <div id="question_stats_items">${question.answers} Answers</div>
            <div id="question_stats_items">${question.views} views</div>
            <div id="question_stats_items">${question.rating} rating</div>
          </div>
        </div>`;
    };

    questionBoxContainer.innerHTML = html;
    addQuestionClickListeners(questionList);
  })();
}

showQuestionColumn("math");

function openProfile(username) {
  window.location = `profile?username=${username}`;
}

const headerSubjects = [
  "Active Questions - Math",
  "Active Questions - Chemistry",
  "Active Questions - Biology",
  "Active Questions - Physics",
  "Active Questions - English",
  "Active Questions - History",
  "Active Questions - Geography",
  "Active Questions - Foreign Language",
  "Active Questions - Computer Science",
  "Active Questions - Physical Education",
];

let currentIndex = 0;

function moveRight() {
  currentIndex = (currentIndex + 1) % headerSubjects.length;
  questionHeader.innerHTML = headerSubjects[currentIndex];
  const targetSubject = headerSubjects[currentIndex].replace("Active Questions - ", "").toLowerCase();
  showQuestionColumn(targetSubject);
}

function moveLeft() {
  currentIndex = ((currentIndex - 1) % headerSubjects.length + headerSubjects.length) % headerSubjects.length;
  questionHeader.innerHTML = headerSubjects[currentIndex];
  const targetSubject = headerSubjects[currentIndex].replace("Active Questions - ", "").toLowerCase();
  showQuestionColumn(targetSubject);
}

document.getElementById("arrow-left").addEventListener("click", debounce(moveLeft, 100));
document.getElementById("arrow-right").addEventListener("click", debounce(moveRight, 100));

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
    <button id="sign_up_as_tutor_button">Sign up as tutor</button>
  `
  }
}

(async () => {

  const totalQuestions = await getQuestionList("all")
  const numQuestions = totalQuestions.length
  var numAnswers = 0

  for (const question of totalQuestions) {
    numAnswers = numAnswers + parseInt(question.answers)
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

    await sleep(10);

    for (let i = 0; i < numDigits; i++) {
      digWheel[i].style.transform = 'translateY(-' + String(30 * strVal[i]) + 'px)';
    }
  }

  setTimeout(() => {
    animate(numQuestions, document.querySelector(".important_box_num1"), 'important_box_num1_digit')
    animate(numAnswers, document.querySelector(".important_box_num2"), 'important_box_num2_digit')
    animate(Math.round(numAnswers/5), document.querySelector(".important_box_num3"), 'important_box_num3_digit')
  }, 50);

})();
