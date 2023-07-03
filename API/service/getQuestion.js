const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})

const util = require('../utils/util')
console.log("called")
const dynamodb = new AWS.DynamoDB.DocumentClient();
const questionTable = 'Freetutor-Question' // connection to database and user table
//creating function to verify if the user is logged in correctly
function getQuestionList(requestBody) {
    const views = requestBody.views;
    const result = getQuestionByViews(views)
    const subject = requestBody.subject
    // const result = getQuestionBySubject(subject)
    const response = {
      questionList: result,
  }    
  return util.buildResponse(200, response);
  
}

async function getQuestionBySubject(subject) { //getting user info to check if the user has already logged in 

    const params = {
        TableName: questionTable,
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
async function getQuestionByViews(views) { //getting user info to check if the user has already logged in 

  const params = {
      TableName: questionTable,
      KeyConditionExpression: "views = :views",
      ExpressionAttributeValues: {
        ":views": views
      },
      Limit: 10
  }
    // Query DynamoDB for the questions.
const result = await dynamodb.query(params).promise();

// Return the questions.
return result.Items;
}
module.exports.getQuestionList = getQuestionList;