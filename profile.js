import config from "./config.js";

const apiUrlget = config.apiUrlget;
const apiUrlgetUser = config.apiUrlgetUser;
const apiUrlupdateUser = config.apiUrlupdateUser
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

console.log('called')
async function showQuestionColumn(user){
    const questionList = await getQuestionListUser(user.user[0].username)
    const questionArray = questionList
    for (const question of questionArray) {
      var title = question.title
      var author = question.author
      var answers = question.answers
      var rating = question.rating
      var timeAgo = getTimeDifference(question.timestamp)
      var views = question.views
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
      
      questionBoxes.forEach((box, index) => {
        console.log('afdfsd')
        box.addEventListener("click", function () {
          console.log("called")
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
async function getQuestionListUser(user) {
    const url = new URL(`${apiUrlget}?username=${user}`);
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
async function changePageInfo(user){
  const cognitoInfo = await getUserCognito(user.username)
  document.querySelector(".about-me-field").innerText = user.about
  document.getElementById('username_txt').innerText = user.username
  document.getElementById('pfp_inner').src = `data:image/png;base64,${user.pfp}`
  document.querySelector(".signup-container_profile").innerHTML = 
    `
    <div class="your_info_txt">Information</div>
    <p class="info-label">Username</p>
    <input class="info_input_group" placeholder=${user.username}>
    <img class="edit_icon" style="top: -172.25px" src="edit_icon.png">
    <p class="info-label">Full Name</p>
    <p class="info_input_group" type=password">${cognitoInfo.UserAttributes[2].Value}</p>
    <p class="info-label">Email</p>
    <p class="info_input_group" type=password">${cognitoInfo.UserAttributes[4].Value}</p>
    <p class="info-label">Questions Asked</p>
    <p class="info_input_group" type=password">${user.questions}</p>
    <p class="info-label">Questions Answered</p>
    <p class="info_input_group" type=password">${user.answers}</p>
    `
}
const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")
async function getUserCognito(username) {
  try {
    const params = {
      UserPoolId: poolId,
      Username: username
    };

    const user = await cognito.adminGetUser(params).promise();
    return user;
  } catch (error) {
      alert("error:"+error+"Please log out and log in again")
  }
}
async function updateAbout(username){
  const about = document.querySelector('.about-me-field').value
  console.log(about)
    const url = new URL(`${apiUrlupdateUser}`)
    const response = await fetch(url,  {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": user.user[0].username,
        "about":about,
      })
    }).then(response => response.json());
    console.log(response)
}
async function updatepfp(username, pfp){
    const url = new URL(`${apiUrlupdateUser}`)
    const response = await fetch(url,  {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": username,
        "pfp":pfp,
      })
    }).then(response => response.json());
    console.log(response)
}
var user = await getUser(username)
await showQuestionColumn(user)
await changePageInfo(user.user[0])
document.querySelector(".updateAbout").addEventListener("click", () =>{
  updateAbout(username)
})

const imgDiv = document.querySelector(".pfp_user")
const img = document.getElementById('pfp_inner')
const file = document.getElementById('file')
const uploadBtn = document.querySelector('uploadBtn')

file.addEventListener('change', function(){
  const choosedFile = this.files[0]
  if(choosedFile){
      const reader = new FileReader()
      reader.addEventListener('load', function(){
        img.setAttribute('src', reader.result)
        const fileData = reader.result.split(',')[1]; // Extract base64 data from Data URL
        updatepfp(username, fileData)
      })
      reader.readAsDataURL(choosedFile)
  }
})