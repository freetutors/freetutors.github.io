const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Freetutor-Question' // connection to database and user table

const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder

async function updateAnswer(event) {
    const questionId = event.queryStringParameters.questionId
    const answerId = event.queryStringParameters.answerId
    const rating = event.queryStringParameters.rating

    const answer = { //question details
        questionId: questionId, //so we can pull it later
        answerId: answerId,
        rating: rating,
    }
    await saveUpdates(answer)
    const response = {
        question: answer,
        questionId: questionId
    }
    return util.buildResponse(200, response);
}
async function saveUpdates(question){ //saving new users to database
    const params = {
        TableName: tableName,
        Key: {
          questionId: answer.questionId
        },
        UpdateExpression: 'SET #answers.#answerId.#rating = :newRating',
        ExpressionAttributeNames: {
          '#answers': 'answers',
          '#answerId': answer.answerId,
          '#rating': 'rating'
        },
        ExpressionAttributeValues: {
          ':newRating': answer.rating
        }
    };

    return await dynamodb.update(params).promise().then(() => {
        return true;
    }, error =>{
        console.error('There is an error saving question: ', error)
    });
}

module.exports.updateAnswer = updateAnswer;