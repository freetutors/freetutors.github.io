import config from './config.js';

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

AWS.config.region = region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: poolId
});

AWS.config.update({
  region: region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey
});

const docClient = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const username = 'testUserForInbox'/*localStorage.getItem('CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser');*/
const user = await getUser(username);


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

async function getUserCognito(username) {
  try {
    const params = {
      UserPoolId: poolId,
      Username: username
    };
    const user = await cognito.adminGetUser(params).promise();
    console.log(user);
    return user;
  } catch (error) {
    alert('Error: ' + error + '. Please log out and log in again.');
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

function getTimestamp() {
  const currentTimestamp = new Date().toISOString();
  return currentTimestamp;
}

(async () => {
   /*const usernames =
    [
      'dsfasdfafsdfa',
      'username',
      'czvvzcxvczxzvcx',
      'rokkc',
      'use',
      'ritsabha',
      'testauthor',
      'humbalumba',
      'faddafs',
      'jignashu',
      'usersdfasadfname',
      'user.',
      'u',
      'testing',
      'testUserForInbox',
    ]
 for (const username1 of usernames) {*/
    if (username !== null) {
      if (/*user.user[0].InboxList == undefined*/true) {
        await updateListAttribute('Freetutor-Users', { username: username }, 'InboxList', [["Welcome to FreeTutors!", getTimestamp()]]);

      }
    }
  })();
