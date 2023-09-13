const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})

const util = require('../utils/util')
const dynamodb = new AWS.DynamoDB.DocumentClient();
const questionTable = 'Freetutor-Question' // connection to database and user table
//creating function to verify if the user is logged in correctly
async function getQuestionList(event) {
  const views = event.queryStringParameters.views;
  const username = event.queryStringParameters.username
  const subject = event.queryStringParameters.subject
    const questionId = event.queryStringParameters.questionId
    if(views =="top"){
      console.log("top-views")
      const result = await topQuestions()
      const response = {
        questionList: result
      }
      return util.buildResponse(200, response)
    }
    if(subject=="all"){
      result = await getAllQuestions()
      const response = {
        questionList: result
      }
      return util.buildResponse(200, response)
    }
    else if (views != null) {
      const result = await getQuestionByViews(views)
      const response = {
        questionList: result,
      }    
      return util.buildResponse(200, response);
    }
    else if(questionId != null){
      const result = await getQuestionById(questionId)
      const response = {
        questionList: result,
      }    
      return util.buildResponse(200, response);
    }
    else if(subject != null){
      const result = await getQuestionBySubject(subject)
      const response = {
        questionList: result,
      }    
      return util.buildResponse(200, response);
    }
    else if(username != null){
      const result = await getQuestionByUser(username)
      const response = {
        questionList: result
      }
      return util.buildResponse(200,response);
    }

    // const result = getQuestionBySubject(subject)

  
}
async function getAllQuestions(){
    console.log("called")
    const params = {
      TableName: questionTable,
    };
    // Scan DynamoDB to get all the questions (Note: Scanning large tables may be slow).
    const result = await dynamodb.scan(params).promise();
    // Return the questions.
    return result.Items;
}
async function getQuestionBySubject(subject) { //getting user info to check if the user has already logged in 

  const params = {
    TableName: questionTable,
    IndexName: "subjectIndex",
    KeyConditionExpression: "#s = :subject",
    ExpressionAttributeNames: {
      "#s": "subject"
    },
    ExpressionAttributeValues: {
      ":subject": subject
    },
    Limit: 20
  };

    // Query DynamoDB for the questions.
    const result = await dynamodb.query(params).promise();
// Return the questions.
    return result.Items;
}
async function getQuestionByViews(views) { //getting user info to check if the user has already logged in 

  const params = {
    TableName: questionTable,
    IndexName: "viewsIndex",
    KeyConditionExpression: "#v = :views",
    ExpressionAttributeNames: {
      "#v": "views"
    },
    ExpressionAttributeValues: {
      ":views": parseInt(views)
    },
    Limit: 10
  };

    // Query DynamoDB for the questions.
    const result = await dynamodb.query(params).promise();
// Return the questions.
    return result.Items;
}
async function getQuestionById(questionId) {
  const params = {
    TableName: questionTable,
    KeyConditionExpression: "#Id = :questionId",
    ExpressionAttributeNames: {
      "#Id": "questionId"
    },
    ExpressionAttributeValues: {
      ":questionId": questionId
    },
    Limit: 10
  };

    // Query DynamoDB for the questions.
    const result = await dynamodb.query(params).promise();
// Return the questions.
    return result.Items;
}
async function getQuestionByUser(author) {
  const params = {
    TableName: questionTable,
    IndexName: "authorIndex",
    KeyConditionExpression: "#a = :author",
    ExpressionAttributeNames: {
      "#a": "author"
    },
    ExpressionAttributeValues: {
      ":author": author
    },
    Limit: 10
  };

    // Query DynamoDB for the questions.
    const result = await dynamodb.query(params).promise();
// Return the questions.
    return result.Items;
}
async function topQuestions(){
  const params = {
    TableName: questionTable,
    IndexName: "viewsIndex",
    KeyConditionExpression: "#v > :views",
    ExpressionAttributeNames:{
      '#v':"views"
    },
    ExpressionAttributeValues:{
      ":views":0
    },
    Limit: 5,
    ScanIndexForward: false
  };
  const result = await dynamodb.query(params).promise();

  return result.Items;
}


module.exports.getQuestionList = getQuestionList;