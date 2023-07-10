const { v4: uuidv4 } = require('uuid');

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Freetutor-Question' // connection to database and user table
const answerId = uuidv4()

const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder

async function createAnswer(answerData) {
    const getParams = {
        TableName: tableName,
        Key: { questionId: answerData.questionId},
    };
    
    const questionData = await dynamodb.get(getParams).promise();
    console.log(questionData)
    if (!questionData.Item.answersInfo) {
        questionData.Item.answersInfo = [];
      }
    // Update the answers array with the new answer
    const newAnswer = { answerId: answerId, body: answerData.body, author: answerData.author, rating: 0, timestamp: new Date().toISOString()};
    questionData.Item.answersInfo.push(newAnswer);
    
    // Save the updated question item back to DynamoDB
    const updateParams = {
        TableName: tableName,
        Item: questionData.Item,
    };
    
    await dynamodb.put(updateParams).promise();
    const response = {
        question: questionData,
        answer: newAnswer
    }
    return util.buildResponse(200, response);

}
module.exports.createAnswer = createAnswer     