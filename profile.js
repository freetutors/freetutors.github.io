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

const docClient = new AWS.DynamoDB.DocumentClient();
var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy

async function showQuestionColumn(user){ //showing the questions the user asked
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
      if (pfp == null){ //getting pfp, if pfp is none it will user default
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
    <p class="info_input_group" type=password">${/*user.questions*/10}</p>
    <p class="info-label">Questions Answered:</p>
    <p class="info_input_group" type=password">${/*user.answers*/10}</p>
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
if (file !== null){
  file.addEventListener('change', function(){
    const choosedFile = this.files[0]
    if (choosedFile) {
      const reader = new FileReader();
      reader.addEventListener('load', async function() {
        const img = new Image();
        img.src = reader.result;
  
        img.onload = async function() {
          const maxDimensions = 720;
          const squareSize = Math.min(img.width, img.height); //finds the smaller dismension, width or height
  
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
  
          const canvas = document.createElement('canvas');
          canvas.width = squareSize; //this canvas code is for squaring
          canvas.height = squareSize;
  
          const context = canvas.getContext('2d');
          const offsetX = (img.width - squareSize) / 2; //centr the square
          const offsetY = (img.height - squareSize) / 2;
          context.drawImage(img, offsetX, offsetY, squareSize, squareSize, 0, 0, squareSize, squareSize);
  
          const squarifiedDataUrl = canvas.toDataURL('image/jpeg', 0.9);//dowgrades to max
          profileImg.setAttribute('src', squarifiedDataUrl); //updates screen circle

          const fileData = squarifiedDataUrl.split(',')[1];

          const questionImg = new Image();
          // Set the source of the Image element to the Base64 image
          questionImg.src = squarifiedDataUrl;
          questionImg.onload = function () {

            const newWidth = 144;  // Adjust as needed
            const newHeight = 144; // Adjust as needed

            // Set the canvas size to the new dimensions
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Draw the image on the canvas with the new dimensions
            context.drawImage(questionImg, 0, 0, newHeight, newHeight);

            // Convert the canvas content to a Base64 image
            resizedBase64Image = canvas.toDataURL('image/jpeg').split(',')[1];
          }

          try {
            await updatepfp(username, fileData);
            user = await getUser(username); //updating page data without any reloading
            await changePageInfo(user.user[0]);
            await showQuestionColumn(user);
            for (const question of await getQuestionListUser(user.user[0].username)) {
              await updateStringAttribute('Freetutor-Question', { questionId: question.questionId }, 'pfp', fileData);
            }
            document.querySelector(".profilePicHome").setAttribute('src', `data:image/png;base64,${fileData}`);
            setTimeout(function() {
              // ...

            }, 3000);
          } catch (error) {
            console.error("Error updating profile picture:", error);
          }
        };
      });
      reader.readAsDataURL(choosedFile);
    }
  })
}

document.getElementById("sign-out").addEventListener("click",() => { //signout
  if (confirm("Do you want sign out?") == true){
    localStorage.clear()
    sessionStorage.clear()
    window.location ='/'
  }
})

/*
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
    console.log(`Updated ${stringAttributeName} attribute in ${tableName} table`);
  } catch (error) {
    console.error(`Error updating ${stringAttributeName} attribute in ${tableName} table`, error);
  }
}

await updateListAttribute('Freetutor-Question', { questionId: '656ee636-45ad-43d6-9ff1-7b946c378aae' }, 'pfp', "asdfasdasdasd");
*/