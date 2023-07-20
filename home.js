// const apiUrlget = config.apiUrlgetConfig;
// const apiUrlgetUser = config.apiUrlgetUserConfig;
console.log(apiUrlget)
async function showQuestionColumn(subject){
    const questionList = await getQuestionListSubject(subject)
    const questionArray = questionList
    console.log(questionArray)
    for (const question of questionArray) {
      var title = question.title
      var author = question.author
      var answers = question.answers
      var rating = question.rating
      var timeAgo = getTimeDifference(question.timestamp)
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
      document.querySelector(".questions_list").innerHTML +=
        `<div class="box text_box">
        <!-- pfp -->
        <img id="text_box_pfp" src="${displayedImage}">
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
      questionBoxes.forEach((box, index) => {
        box.addEventListener("click", function () {
          const questionId = questionList[index].questionId; // Retrieve the questionId
          localStorage.setItem("QuestionID", JSON.stringify(questionId));
          window.location = `viewQuestion?questionId=${questionId}`;
        });
      });
    };
async function getUser(username){
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
async function getQuestionListSubject(subject) {
    const url = new URL(`${apiUrlget}?subject=${subject}`);
    const questionList = await fetch(url,  {
        mode: "cors",
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    }).then(response => response.json());
    return questionList.questionList
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
    return questionList.questionList
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
    
const subjects = [ //htmlSection
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
  var targetSubject = "math"
  showQuestionColumn(targetSubject)
  function moveRight() {
    document.querySelector('.questions_list').innerHTML = ""
    questionHeader.innerHTML = subjects[(subjects.indexOf(questionHeader.innerHTML) + 1) % (subjects.length)]
    targetSubject = questionHeader.innerHTML.replace("Active Questions - ", "").toLowerCase()
    showQuestionColumn(targetSubject)
}

  function moveLeft() {
    document.querySelector('.questions_list').innerHTML = ""
    questionHeader.innerHTML = subjects[((subjects.indexOf(questionHeader.innerHTML) - 1) % (subjects.length) + (subjects.length)) % (subjects.length)]
    targetSubject = questionHeader.innerHTML.replace("Active Questions - ", "").toLowerCase()
    showQuestionColumn(targetSubject)

}