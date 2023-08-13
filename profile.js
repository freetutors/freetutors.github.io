import config from "./config.js";

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
var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy

async function showQuestionColumn(user){ //showing the questions the user asked
  console.log('called')
  const questionList = await getQuestionListUser(user.user[0].username)
    const questionArray = questionList
    document.querySelector(".questions_list").innerHTML = ''
    for (const question of questionArray) {
      var title = question.title //getting question data
      var author = question.author
      var answers = question.answers
      var rating = question.rating
      var timeAgo = getTimeDifference(question.timestamp)
      var views = question.views
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
}
async function updatepfp(username, pfp){ //updating pfp for user
    const url = new URL(`${apiUrlupdateUser}`)
    console.log("called")
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
    console.log(response)
}

async function updateQuestionPfp(username, pfp) {
  console.log(pfp)
}

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
  document.querySelector("#sign-out").style.display = "none"
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

file.addEventListener('change', function(){
  const choosedFile = this.files[0]
  if(choosedFile){
      // const reader = new FileReader()
      // reader.addEventListener('load', function(){
      //   img.setAttribute('src', reader.result)
      //   const fileData = reader.result.split(',')[1]; // Extract base64 data from Data URL
      //   updatepfp(username, fileData)
      //   setTimeout(function() {
      //     //your code to be executed after 1 second
      //     location.reload()
      //   }, 3000);
      // })
      // reader.readAsDataURL(choosedFile)
      //below is the squarifying code, what happens is html cuts the image into a square and then js reads and converts into a base64 to store
      const reader = new FileReader();
      reader.addEventListener('load', function(){
        const img = new Image(); //this is creating a new img
        img.src = reader.result;
        // console.log(img.src)
      img.onload = async function() {
        const squareSize = Math.min(img.width, img.height); //picks the lower value
        const canvas = document.createElement('canvas'); //this is the html elemnet for cutting the image
        canvas.width = squareSize; //setting width and height to the same min value
        canvas.height = squareSize;

        const context = canvas.getContext('2d'); //allowing canvas element to have new img
        const offsetX = (img.width - squareSize) / 2; //centering image horizontally
        const offsetY = (img.height - squareSize) / 2; //centering image vertically
        context.drawImage(img, offsetX, offsetY, squareSize, squareSize, 0, 0, squareSize, squareSize); //putting in image with all values

        const croppedDataUrl = canvas.toDataURL('image/png'); //converting to readable value, honestly i dont fully understand what happens here
        profileImg.setAttribute('src', croppedDataUrl); //updating current html

        const fileData = croppedDataUrl.split(',')[1]; // Extract base64 data from Data URL
        console.log(fileData)
        try {
          await updatepfp(username, fileData);
          console.log("Profile picture updated successfully");
          console.log(username)
          user = await getUser(username)
          console.log(user)
          await changePageInfo(user.user[0])
          await showQuestionColumn(user)
          document.querySelector(".profilePicHome").setAttribute('src', `data:image/png;base64,${fileData}`)
          setTimeout(function() {
            console.log(user)

          }, 3000);
        } catch (error) {
          console.error("Error updating profile picture:", error);
        }
      };
      });
      reader.readAsDataURL(choosedFile);
  }
})
document.getElementById("sign-out").addEventListener("click",() => { //signout
  if (confirm("Do you want sign out?") == true){
    localStorage.clear()
    sessionStorage.clear()
    window.location ='/'
  }
})

