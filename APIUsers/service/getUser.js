const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})

const util = require('../utils/util')
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'Freetutor-Users' // connection to database and user table
//creating function to verify if the user is logged in correctly
async function getUser(event) {
  const username = event.queryStringParameters.username;
  
  const target = event.queryStringParameters.target
  if (target === "pfp") {
    const result = await findUser(username)
    const response = {
      questionList: result,
    }    
    return util.buildResponse(200, response);
  }
    // const result = getQuestionBySubject(subject)

  
}

async function findUser(username) { //getting user info to check if the user has already logged in 

  const params = {
    TableName: userTable,
    KeyConditionExpression: "#u = :username",
    ExpressionAttributeNames: {
      "#u": "username"
    },
    ExpressionAttributeValues: {
      ":username": username
    },
    Limit: 20
  };

    // Query DynamoDB for the questions.
    const result = await dynamodb.query(params).promise();
// Return the questions.
    return result.Items;
}

module.exports.getUser = getUser;