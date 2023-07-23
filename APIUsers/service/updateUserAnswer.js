const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
const fs = require('fs')
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Freetutor-Users' // connection to database and user table

const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder
async function updateUserAnswers(updateBody) {
    console.log(updateBody)
    const answers = parseInt(updateBody.answers) 
    console.log(answers)
    const username = updateBody.username
    console.log(answers)
    const user = {
        username: username,
        answers: answers
    }
    await saveanswers(user)
    const response = {
        user: user,
        answers: answers
    }
    return util.buildResponse(200, response);
}
async function saveanswers(user){ //saving new users to database
    const params = {
        TableName: tableName,
        Key: {
            username: user.username
        }
    ,
    UpdateExpression: 'SET #answers = :answers',
    ExpressionAttributeNames: {
      '#answers': 'answers',
    },
    ExpressionAttributeValues: {
      ":answers": user.answers
    }
  };
    return await dynamodb.update(params).promise().then(() => {
        return true;
    }, error =>{
        console.error('There is an error saving answers: ', error)
    });
}
module.exports.updateUserAnswers = updateUserAnswers;