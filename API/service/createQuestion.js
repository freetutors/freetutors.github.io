const { v4: uuidv4 } = require('uuid');

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
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
const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder

async function createQuestion(questionData) {
    const title = questionData.title
    const body = questionData.body //body with formatting
    const author = questionData.author
    const subject = questionData.subject
    const pfp = questionData.pfp
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
            const question = { //question details
                questionId: questionId, //so we can pull it later
                title: title,
                body: body,
                author: author.trim(), //username trimmed to get rid of whtie space
                rating: 0,
                views: 0,
                answers: 0,
                pfp: pfp,
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