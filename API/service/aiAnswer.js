const { v4: uuidv4 } = require('uuid');
const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
//INSERT API KEY
const genAI = new GoogleGenerativeAI('AIzaSyBRsd0Nhu1S5sGsqADCocKl4YVQQPoj6s4');
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: " If there is an image, say that you can see an image and may not read it correctly. If there is a base64 image in the prompt, give an disclaimer that you may be inaccurate at reading the image. You are a tutor for school students. You will be given a question first, and then more information following the text 'MORE DETAILS:'. the following text will have html markings around them, images will also be in base64 form. Use the image to help your response. ALWAYS EXPLAIN YOUR ANSWER. Notes for syntax: Use latex notation for mathematical or scientific notation. Wrap the equation/text/desired characters in $ to indicate latex to perform(instructions sourced at https://www.bu.edu/math/files/2013/08/LongTeX1.pdf). To create a new line ur <br>. Try to keep the answer within 200 words. For text formatting use html notations(e.i. <stong>BOLDED TEXT</strong>) DO NOT USE two asterisks (**) on both sides of text in order to bold text, instead use <strong> on the left and </strong> on the right. If you do not know the answer or run into an error interpreting the question return an empty response(nothing)",
});
async function generateAIResponse(body) {
    const prompt = body
    console.log('geminicalled')
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = await response.text();
    return responseText
}

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Freetutor-Question' // connection to database and user table
async function createAIAnswer(questionId) {
    console.log('called')
    console.log(questionId)
    const answerId = uuidv4()
    const getParams = {
        TableName: tableName,
        Key: { questionId: questionId},
    };
    
    const questionData = await dynamodb.get(getParams).promise();
    console.log(questionData)
    if (!questionData.Item.answersInfo) {
        questionData.Item.answersInfo = [];
      }
    //INSERT AI ENCODING HERE
    //
    const AiPrompt = questionData.Item.title.concat("MORE DETAILS:", questionData.Item.body)
    console.log(AiPrompt)
    const AIresponse = await generateAIResponse(AiPrompt)
    // Update the answers array with the new answer
    if (AIresponse){
        const newAnswer = { answerId: answerId, body: AIresponse, author: 'Robo-Tutor', rating: 0, timestamp: new Date().toISOString()};

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
    else{
        return util.buildResponse(502, "Error loading Gemini AI response");
    }


}

module.exports.createAIAnswer = createAIAnswer;