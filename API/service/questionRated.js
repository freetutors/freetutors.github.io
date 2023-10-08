const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Freetutor-Question' // connection to database and user table

const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder

async function updateQuestion(event) {
    const questionId = event.queryStringParameters.questionId
    const user = event.queryStringParameters.user
    const ratingValue = event.queryStringParameters.rating //body with formatting
    
    const getParams = {
        TableName: tableName,
        Key: { questionId: questionId},
    };
    const ratedQuestion = await dynamodb.get(getParams).promise();
    const rating = {
        user: user,
        ratingValue: ratingValue,
    }
    if (!ratedQuestion.Item.userRatings) {
        ratedQuestion.Item.userRatings = [];
      }
    // Check if an entry with the provided user already exists
    const existingRatingIndex = ratedQuestion.Item.userRatings.findIndex(
        (entry) => entry.user === user
    );

    if (existingRatingIndex !== -1) {
        // If the user already rated, update the existing entry
        ratedQuestion.Item.userRatings[existingRatingIndex] = rating;
    } else {
        // If the user hasn't rated before, add a new entry
        ratedQuestion.Item.userRatings.push(rating);
    }

    const updateParams = {
        TableName: tableName,
        Item: ratedQuestion.Item,
    };
    
    await dynamodb.put(updateParams).promise();
    const response = {
        question: ratedQuestion,
        ratingValue: rating
    }
    return util.buildResponse(200, response);
}

module.exports.updateQuestion = updateQuestion;