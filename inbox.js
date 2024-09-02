// import config from './config.js';
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

var path = window.location.pathname;
var pageName = path.split("/").pop();

const {
  apiUrlget,
  apiUrlgetUser,
  apiUrlupdateUser,
  poolId,
  clientId,
  region,
  accessKey,
  secretKey
} = config;

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

const docClient = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const username = /*'testUserForInbox'*/localStorage.getItem('CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser');
var user = await getUser(username);

async function getUser(username) {
  try {
    const url = new URL(`${apiUrlgetUser}?username=${username}`);
    const user = await fetch(url, {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json());
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}


async function updateListAttribute(tableName, key, listAttributeName, listAttributeValue) {
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: 'SET #listAttribute = :listAttributeValue',
    ExpressionAttributeNames: {
      '#listAttribute': listAttributeName
    },
    ExpressionAttributeValues: {
      ':listAttributeValue': listAttributeValue
    }
  };
  try {
    await docClient.update(params).promise();
    console.log(`Updated ${listAttributeName} attribute in ${tableName} table`);
  } catch (error) {
    console.error(`Error updating ${listAttributeName} attribute in ${tableName} table`, error);
  }
}

function inboxDisplay() {
  const inbox = document.querySelector('.inbox');

  if ((inbox.style.display === "none") || (inbox.style.display === "")) {
    inbox.style.display = "block";
  } else {
    inbox.style.display = "none";
  }
}

function getTimestamp() {
  const currentTimestamp = new Date().toISOString();
  return currentTimestamp;
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

async function updateOnAnswer() {
  console.log(username)
  const questionAuthor = document.querySelector("#question-wrapper > div.question > div.pfpRow > div > div > p").textContent
  const questionUser = await getUser(questionAuthor)
  const messages = questionUser.user[0].InboxList
  messages.push(['Your ' + '<a href=' + window.location.href + '>question</a>' + ' has been answered', getTimestamp()])
  await updateListAttribute('Freetutor-Users', { username: questionAuthor }, 'InboxList', messages);
  await updateBooleanAttribute('Freetutor-Users', { username: questionAuthor }, 'isRead', false);
}

async function updateBooleanAttribute(tableName, key, attributeName, attributeValue) {
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: 'SET #attributeName = :attributeValue',
    ExpressionAttributeNames: {
      '#attributeName': attributeName,
    },
    ExpressionAttributeValues: {
      ':attributeValue': attributeValue,
    },
  };
  try {
    await docClient.update(params).promise();
    console.log(`Updated ${attributeName} attribute in ${tableName} table`);
  } catch (error) {
    console.error(`Error updating ${attributeName} attribute in ${tableName} table`, error);
  }
}

(async () => {

  async function inboxDisplay() {
    const inbox = document.querySelector('.inbox');
    if ((inbox.style.display === "none") || (inbox.style.display === "")) {
      inbox.style.display = "block";
      await updateBooleanAttribute('Freetutor-Users', { username: username }, 'isRead', true);
      document.querySelector(".notif").style.display = "none"
    } else {
      inbox.style.display = "none";
    }
  }


  const inbox = document.querySelector(".inbox")

  if (username !== null) {
    console.log("hi");
    if (user.user[0].InboxList == undefined) {
      await updateListAttribute('Freetutor-Users', { username: username }, 'InboxList', [["Welcome to FreeTutors!", getTimestamp()]]);
      await updateBooleanAttribute('Freetutor-Users', { username: username }, 'isRead', false);
    }

  user = await getUser(username)
  const messages = user.user[0].InboxList.reverse()

  for (const message of messages) {
    document.querySelector(".inbox").innerHTML +=
    `
      <div class="inboxLetters">${message[0]}</div>
      <div class="inboxTime">${getTimeDifference(message[1])}</div>
      <hr class="inboxLine">
    `
  }

  document.querySelector(".inboxButton").addEventListener("click", inboxDisplay)
  }



if (username !== null) {
  if (pageName == 'viewQuestion') {
    document.getElementById("answer-send").addEventListener("click", updateOnAnswer)
  }
}

if (username !== null) {
  user = await getUser(username);
  if (user.user[0].isRead == false) {
    document.querySelector(".notif").style.display = "block"
  }
}

})();

