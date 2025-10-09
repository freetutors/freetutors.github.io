const { v4: uuidv4 } = require('uuid');
const AIresponseService = require('./aiAnswer.js');

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
//INSERT API KEY
const genAI = new GoogleGenerativeAI('AIzaSyDY48B46HZ1W3nAf8OOllsj6qtYeRcyVGg');
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "You are a tutor for school students. You will be given a question first, and then more information following the text 'MORE DETAILS:'. the following text will have html markings around them, images will also be in base64 form. Use the image to help your response. ALWAYS EXPLAIN YOUR ANSWER",
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Freetutor-Question' // connection to database and user table
var questionId = randomizeUUIDv4()
function randomizeUUIDv4() {
    // Generate a new UUIDv4
    const originalUUID = uuidv4();
  
    // Convert the UUID to an array of characters
    const uuidArray = originalUUID.split('');
  
    // Iterate through the characters and replace them with random hexadecimal digits
    for (let i = 0; i < uuidArray.length; i++) {
      if (/[0-9a-f]/.test(uuidArray[i])) {
        // Randomly choose a new hexadecimal digit (0-9 or a-f)
        const randomHexDigit = Math.floor(Math.random() * 16).toString(16);
        uuidArray[i] = randomHexDigit;
      }
    }
  
    // Join the modified array back into a UUID string
    const randomizedUUID = uuidArray.join('');
  
    return randomizedUUID;
  }

// async function generateAIResponse(body) {
//     const prompt = body
//     console.log('called')
//     const result = await model.generateContent(prompt);
//     console.log(result)
//     const response = await result.response;
//     console.log(response)
//     const responseText = await response.text();
//     console.log(responseText);
//     return responseText
// }

async function getQuestionById(questionId) {
const params = {
    TableName: tableName,
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
const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder

// async function createAIAnswer(questionId) {
//     console.log('called')
//     const answerId = uuidv4()
//     const getParams = {
//         TableName: tableName,
//         Key: { questionId: questionId},
//     };
    
//     const questionData = await dynamodb.get(getParams).promise();
//     console.log(questionData)
//     if (!questionData.Item.answersInfo) {
//         questionData.Item.answersInfo = [];
//       }
//     //INSERT AI ENCODING HERE
//     //
//     const AiPrompt = questionData.title.concat("MORE DETAILS:", questionData.body)
//     console.log(AiPrompt)
//     const AIresponse = generateAIResponse(AiPrompt)
//     // Update the answers array with the new answer
//     const newAnswer = { answerId: answerId, body: AIresponse, author: 'Robo-Tutor', rating: 0, timestamp: new Date().toISOString()};
//     questionData.Item.answersInfo.push(newAnswer);
    
//     // Save the updated question item back to DynamoDB
//     const updateParams = {
//         TableName: tableName,
//         Item: questionData.Item,
//     };
    
//     await dynamodb.put(updateParams).promise();
//     const response = {
//         question: questionData,
//         answer: newAnswer
//     }
//     return util.buildResponse(200, response);

// }
async function createQuestion(questionData) {
    const title = questionData.title
    const body = questionData.body //body with formatting
    const author = questionData.author
    const subject = questionData.subject
    const pfp = questionData.pfp
    const userRatings = []
    const timestamp = new Date().toISOString();
    do {
        questionId = randomizeUUIDv4();
        const duplicateCheck = await getQuestionById(questionId);
        if (duplicateCheck.length === 0) {
            break; // Exit the loop if the generated questionId is unique
        }else{
            setTimeout(function(){
                console.log("need to wait")
            },1000)
        }
        } while (true);
    
        if (!title || !body || !author || !timestamp) { //checking for all categories filled, || = or
            return util.buildResponse(401, { // any arbitrary error number works BUT NOT 200 or 404
                message: 'Missing Info'
            })
        }
        // const answerId = uuidv4()
        // const AiPrompt = questionData.title.concat("MORE DETAILS:", questionData.body)
        // console.log(AiPrompt)
        // const AIresponse = await generateAIResponse(AiPrompt)
        // const newAnswer = { answerId: answerId, body: AIresponse, author: 'Robo-Tutor', rating: 0, timestamp: new Date().toISOString()};
            const question = { //question details
                questionId: questionId, //so we can pull it later
                title: title,
                body: body,
                author: author.trim(), //username trimmed to get rid of whtie space
                rating: 0,
                views: 0,
                answers: 1,
                pfp: pfp,
                timestamp: timestamp,
                subject: subject,
                userRatings: userRatings,
                answersInfo: [],
                answerRatings: [],
            }
            await saveQuestion(question)
            const response = {
                question: question,
                questionId: questionId
            }
            console.log(questionId)
            await AIresponseService.createAIAnswer(questionId)
            return util.buildResponse(200, response);
            
    
}
async function saveQuestion(question){ //saving new users to database
    const params = {
        TableName: tableName,
        Item: question
    }
    return await dynamodb.put(params).promise().then(() => {
        // createAIAnswer(questionId)
        return true;
    }, error =>{
        console.error('There is an error saving question: ', error)
    });
    
}

module.exports.createQuestion = createQuestion;