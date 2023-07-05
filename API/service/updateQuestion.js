const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Freetutor-Question' // connection to database and user table

const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder

async function updateQuestion(event) {
    const questionId = event.queryStringParameters.questionId
    const answers = event.queryStringParameters.answers
    const views = event.queryStringParameters.views //body with formatting
    const rating = event.queryStringParameters.rating

    const question = { //question details
        questionId: questionId, //so we can pull it later
        views: views,
        rating: rating,
        answers: answers,
    }
    await saveUpdates(question)
    const response = {
        question: question,
        questionId: questionId
    }
    return util.buildResponse(200, response);
}
async function saveUpdates(question){ //saving new users to database
    const params = {
        TableName: tableName,
        Key: {
            questionId: question.questionId
        }
    ,
    UpdateExpression: 'SET #views = :views, #rating = :rating, #answers = :answers',
    ExpressionAttributeNames: {
      '#views': 'views',
      '#rating': 'rating',
      '#answers': 'answers'
    },
    ExpressionAttributeValues: {
      ':views': question.views,
      ':rating': question.rating,
      ':answers': question.answers
    }
  };
    return await dynamodb.update(params).promise().then(() => {
        return true;
    }, error =>{
        console.error('There is an error saving question: ', error)
    });
}

module.exports.updateQuestion = updateQuestion;