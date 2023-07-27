import config from "./config.js";

const apiUrlget = config.apiUrlget;
const apiUrlgetUser = config.apiUrlgetUser;

const subjects = [
  "Active Questions - Chemistry",
  "Active Questions - Biology",
  "Active Questions - Physics",
  "Active Questions - English",
  "Active Questions - History",
  "Active Questions - Geography",
  "Active Questions - Foreign Language",
  "Active Questions - Computer Science",
  "Active Questions - Physical Education",
  "Active Questions - Math",
];

const questionHeader = document.querySelector('.question_header');
let targetSubject = "math";

document.getElementById("arrow-left").addEventListener("click", debounce(moveLeft, 100));
document.getElementById("arrow-right").addEventListener("click", debounce(moveRight, 100));

const questionBoxContainer = document.querySelector(".questions_list");
showQuestionColumn(targetSubject);

const userCache = new Map();

async function showQuestionColumn(subject) {
  const questionList = await getQuestionListSubject(subject);
  const users = await Promise.all(questionList.map(question => getUser(question.author)));

  const fragment = document.createDocumentFragment();
  questionList.forEach((question, index) => {
    const user = users[index];
    const pfp = userCache.get(question.author) || user.user[0].pfp;
    if (!userCache.has(question.author)) {
      userCache.set(question.author, pfp);
    }
    const displayedImage = pfp == null
      ? "placeholder_pfp.png"
      : `data:image/png;base64,${pfp}`;

    const questionBox = document.createElement("div");
    questionBox.classList.add("box", "text_box");
    questionBox.innerHTML = `
      <img id="global_pfp" src="${displayedImage}">
      <div id="text_box_question_content">${question.title}</div>
      <div id="asked_by_line">asked by ${question.author}, ${getTimeDifference(question.timestamp)}</div>
      <div id="answered_by_line">Be the first to answer!</div>
      <div class="question_stats">
        <div id="question_stats_items">${question.answers} Answers</div>
        <div id="question_stats_items">${question.views} views</div>
        <div id="question_stats_items">${question.rating} rating</div>
      </div>
    `;
    fragment.appendChild(questionBox);
  });

  questionBoxContainer.innerHTML = "";
  questionBoxContainer.appendChild(fragment);

  addQuestionClickListeners(questionList);
}


function addQuestionClickListeners(questionList) {
  questionBoxContainer.querySelectorAll(".box.text_box").forEach((box, index) => {
    box.addEventListener("click", function (event) {
      if (event.target.id === "global_pfp") {
        const questionAuthor = questionList[index].author;
        openProfile(questionAuthor)
      } else {
        const questionId = questionList[index].questionId;
        localStorage.setItem("QuestionID", JSON.stringify(questionId));
        window.location = `viewQuestion?questionId=${questionId}`;
      }
    });
  });
}

async function getUser(username) {
  if (userCache.has(username)) {
    return { user: [{ pfp: userCache.get(username) }] };
  }
  const url = new URL(`${apiUrlgetUser}?username=${username}`);
  const user = await fetch(url, {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
  return user;
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

function getTimeDifference(timestamp) {
  const currentTime = Date.now();
  const previousTime = new Date(timestamp).getTime();
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

function moveRight() {
  const currentIndex = subjects.indexOf(questionHeader.innerHTML);
  const nextIndex = (currentIndex + 1) % subjects.length;
  questionHeader.innerHTML = subjects[nextIndex];
  targetSubject = subjects[nextIndex].replace("Active Questions - ", "").toLowerCase();
  showQuestionColumn(targetSubject);
}

function moveLeft() {
  const currentIndex = subjects.indexOf(questionHeader.innerHTML);
  const prevIndex = ((currentIndex - 1) % subjects.length + subjects.length) % subjects.length;
  questionHeader.innerHTML = subjects[prevIndex];
  targetSubject = subjects[prevIndex].replace("Active Questions - ", "").toLowerCase();
  showQuestionColumn(targetSubject);
}

function openProfile(username) {
  window.location = `profile?username=${username}`;
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}