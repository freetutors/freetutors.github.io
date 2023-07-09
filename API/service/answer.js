const { v4: uuidv4 } = require('uuid');

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Freetutor-Question' // connection to database and user table
var answerId = uuidv4()

const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder

async function createAnswer(answerData) {
    const getParams = {
        TableName: tableName,
        Key: { questionId: answerData.questionId},
    };
    
    const questionData = await dynamodb.get(getParams).promise();
    
    // Update the answers array with the new answer
    const newAnswer = { answerId: answerId, body: answerData.body, author: answerData.author, rating: 0, timestamp: new Date().toISOString()};
    questionData.Item.answers.push(newAnswer);
    
    // Save the updated question item back to DynamoDB
    const updateParams = {
        TableName: tableName,
        Item: questionData.Item,
    };
    
    await dynamodb.put(updateParams).promise();
}
module.exports.createAnswer() = createAnswer()     