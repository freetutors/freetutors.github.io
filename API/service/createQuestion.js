const { v4: uuidv4 } = require('uuid');

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Freetutor-Question' // connection to database and user table
const questionId = uuidv4()

const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder

async function createQuestion(questionData) {
    const title = questionData.title
    const body = questionData.body //body with formatting
    const author = questionData.author
    const timestamp = new Date().toISOString();
    const subject = "misc"
    if (!title || !body || !author || !timestamp) { //checking for all categories filled, || = or
    return util.buildResponse(401, { // any arbitrary error number works BUT NOT 200 or 404
        message: 'Missing Info'
    })
    }
    const question = { //question details
        questionId: questionId, //so we can pull it later
        title: title,
        body: body,
        author: author.trim(), //username trimmed to get rid of whtie space
        rating: 0,
        views: 0,
        answers: 0,
        timestamp: timestamp,
        subject: subject
    }
    await saveQuestion(question)
    const response = {
        question: question,
        questionId: questionId
    }
    return util.buildResponse(200, response);
}
async function saveQuestion(question){ //saving new users to database
    const params = {
        TableName: tableName,
        Item: question
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error =>{
        console.error('There is an error saving question: ', error)
    });
}

module.exports.createQuestion = createQuestion;