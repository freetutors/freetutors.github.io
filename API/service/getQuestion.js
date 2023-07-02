const { request } = require('http');
const util = require('../utils/util')
console.log("called")
const dynamodb = new AWS.DynamoDB.DocumentClient();
const questionTable = 'freetutor-questions' // connection to database and user table
//creating function to verify if the user is logged in correctly
function getQuestionList(requestBody) {
    const subject = requestBody.subject
    getQuestionBySubject(subject)
}

async function getQuestionBySubject(subject) { //getting user info to check if the user has already logged in 

    const params = {
        TableName: userTable,
        KeyConditionExpression: "#subject = :subject",
        ExpressionAttributeNames: {
          "#subject": "subject"
        },
        ExpressionAttributeValues: {
          ":subject": subject
        },
        Limit: 10
    }
      // Query DynamoDB for the questions.
  const result = await dynamodb.query(params).promise();

  // Return the questions.
  return result.Items;
}

module.exports.getQuestionList = getQuestionList;