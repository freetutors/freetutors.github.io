// import config from "./config.js";

//manually importing config data from json cause ios errors
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

const apiUrlget = config.apiUrlget;
const apiUrlgetUser = config.apiUrlgetUser;
const apiUrlupdateUser = config.apiUrlupdateUser
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

const docClient = new AWS.DynamoDB.DocumentClient();
var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy

async function showQuestionColumn(user){ //showing the questions the user asked
  const questionList = await getQuestionListUser(user.user[0].username)
    const questionArray = questionList
    document.querySelector(".questions_list").innerHTML = ''
    for (const question of questionArray) {
      var title = question.title //getting question data
      var author = question.author
      var unformattedAuthor = question.author
      if (!question.answersInfo){
        var answers = 0

      }else{
          var answers = question.answersInfo.length
      }
      var rating = question.rating
      var timeAgo = getTimeDifference(question.timestamp)
      var views = question.views
      const pfp = user.user[0].pfp
      var displayedImage = ""
      if (pfp == null){ //getting pfp, if pfp is none it will user default
        displayedImage = "placeholder_pfp.png"
      }
      else{
        displayedImage = `data:image/png;base64,${pfp}`
      }
      author = author.replace(/\./g,"")
      if (answers != 0){
        document.querySelector(".questions_list").innerHTML += //sending html info
              `<div class="box text_box" id = "${question.questionId}">
      <!-- pfp -->
      <img id="global_pfp" class = "pfp${author}" src="${displayedImage}" alt="user_pfp" onclick="window.location='/profile?username=${unformattedAuthor}'">
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
              `<div class="box text_box" id = "${question.questionId}">
      <!-- pfp -->
      <img id="global_pfp" class = "pfp${author}" src="${displayedImage}" alt="user_pfp" onclick="window.location='/profile?username=${unformattedAuthor}'">
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
        console.log(boxHeight)
        if (boxHeight >= 141 && boxHeight <= 161){
            stats.style.marginTop = '20px'
            profilePic.style.transform = 'translateY(22px)' 
        }
        else if (boxHeight >= 120 && boxHeight <= 140){
            stats.style.marginTop = '15px'
            profilePic.style.transform = 'translateY(17.5px)' 
            questionElement.querySelector("#answered_by_line").style.marginTop = '25px'
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
        box.addEventListener("click", function () {
          const questionId = questionList[index].questionId; // Retrieve the questionId
          localStorage.setItem("QuestionID", JSON.stringify(questionId));
          window.location = `viewQuestion?questionId=${questionId}&title=${title}`;
        });
      });
    };
async function getUser(username){ //getting user info from dynamo
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
async function getQuestionListUser(user) { //getting user's quetsions from dynamo
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
function getTimeDifference(timestamp) { //giving time in terms of ago
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
async function changePageInfo(user){ //updating html values on page
  const cognitoInfo = await getUserCognito(user.username)
  document.querySelector(".about-me-field").innerText = user.about
  document.getElementById('username_txt').innerText = user.username//user.username
  document.getElementById('pfp_inner').src = `data:image/png;base64,${user.pfp}`
  const username = urlParams.get('username')//getting username from url
  const viewerUsername = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser") //getting viewer's username
  if(username != viewerUsername){
    document.querySelector(".signup-container_profile").innerHTML =
    `
    <div class="your_info_txt">Information</div>
    <p class="info-label">Username:</p>
    <p class="username info_input_group">${user.username}</p>
    <p class="info-label">Questions Asked:</p>
    <p class="info_input_group" type=password">${user.questions}</p>
    <p class="info-label">Questions Answered:</p>
    <p class="info_input_group" type=password">${user.answers}</p>
    `
}else{
  document.querySelector(".signup-container_profile").innerHTML =
    `
    <div class="your_info_txt">Information</div>
    <p class="info-label">Username:</p>
    <p class="username info_input_group">${user.username}</p>
    <p class="info-label">Full Name:</p>
    <p class="info_input_group" type=password">${cognitoInfo.UserAttributes[2].Value}</p>
    <p class="info-label">Email:</p>
    <p class="info_input_group" type=password">${cognitoInfo.UserAttributes[4].Value}</p>
    <p class="info-label">Questions Asked:</p>
    <p class="info_input_group" type=password">${user.questions}</p>
    <p class="info-label">Questions Answered:</p>
    <p class="info_input_group" type=password">${user.answers}</p>
    `
}
}
async function getUserCognito(username) { //getting email and name from cognito
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

async function updateAbout(username){ //updating about me info
  const about = document.querySelector('.about-me-field').value
    const url = new URL(`${apiUrlupdateUser}`)
    const response = await fetch(url,  {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": username,
        "about":about,
      })
    }).then(response => response.json());
  alert("About Me Updated!")
}
async function updatepfp(username, pfp){ //updating pfp for user
    const url = new URL(`${apiUrlupdateUser}`)
    const response = await fetch(url,  {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": username,
        "pfp": pfp,
      })
    }).then(response => response.json());
}

async function updateQuestionPfp(username, pfp) {

}

async function updateStringAttribute(tableName, key, stringAttributeName, newStringValue) {
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: 'SET #stringAttribute = :newStringValue',
    ExpressionAttributeNames: {
      '#stringAttribute': stringAttributeName
    },
    ExpressionAttributeValues: {
      ':newStringValue': newStringValue
    }
  };
  try {
    await docClient.update(params).promise();
  } catch (error) {
    console.error(`Error updating ${stringAttributeName} attribute in ${tableName} table`, error);
  }
}

var resizedBase64Image
const urlParams = new URLSearchParams(window.location.search); 
const username = urlParams.get('username')//getting username from url
const viewerUsername = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser") //getting viewer's username
if (username !== viewerUsername){
  document.querySelector(".pfp_border").innerHTML=
      `
      <img id="pfp_inner" class ="pfp_inner2" src="placeholder_pfp.png">
      `
      document.querySelector(".about-me-field").readOnly = true; 
      document.getElementById("pfp_inner")
      document.querySelector(".updateAbout").style.display="none"
}
var user = await getUser(username) //getting user
await showQuestionColumn(user) //calling functinos
await changePageInfo(user.user[0])
document.querySelector(".updateAbout").addEventListener("click", () =>{ //when about updated
  updateAbout(username)
})

const profileImg = document.getElementById('pfp_inner')
const file = document.getElementById('file')
const img = document.getElementById('pfp_inner')
if (file !== null){
  file.addEventListener('change', function(){
    const choosedFile = this.files[0]
    if (choosedFile) {
      const reader = new FileReader();
      reader.addEventListener('load', async function() {
        const img = new Image();
        img.src = reader.result;
  
        img.onload = async function() {
          if (window.innerWidth > 800){
            var maxDimensions = 288;
          } else{
            var maxDimensions = 144
          }
          alert(maxDimensions)
          //finds the smaller dismension, width or height
  
          // Check if the image dimensions exceed the maximum dimensions
          let width = img.width;
          let height = img.height;

          if (width > maxDimensions || height > maxDimensions) {
            if (width > height) {
              height = (height / width) * maxDimensions;
              width = maxDimensions;
            } else {
              width = (width / height) * maxDimensions;
              height = maxDimensions;
            } //basically this makes it the max quality our database can handle
          }
          const squareSize = Math.min(width, height);
          const canvas = document.createElement('canvas');
          canvas.width = squareSize; //this canvas code is for squaring
          canvas.height = squareSize;
          alert(canvas.width, canvas.height, "hadsfi")
          const context = canvas.getContext('2d');
          const offsetX = (width - squareSize) / 2; //centr the square
          const offsetY = (height - squareSize);
          context.drawImage(img, offsetX, offsetY, squareSize, squareSize);
  
          const squarifiedDataUrl = canvas.toDataURL('image/jpeg', 0.9);//dowgrades to max
          profileImg.setAttribute('src', squarifiedDataUrl); //updates screen circle

          const fileData = squarifiedDataUrl.split(',')[1];

          try {
            await updatepfp(username, fileData);
            user = await getUser(username);
            await changePageInfo(user.user[0]);
            await showQuestionColumn(user);
            if (document.querySelector(".profilePicHome") !== null){
              document.querySelector(".profilePicHome").setAttribute('src', `data:image/png;base64,${fileData}`);
            }
            setTimeout(function() {

            }, 3000);
          } catch (error) {
            console.error("Error updating profile picture:", error);
            alert(error)
          }
        };
      });
      reader.readAsDataURL(choosedFile);
    }
  })
}

