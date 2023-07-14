const AWS = require('aws-sdk');
const DDB = require('aws-sdk/clients/dynamodb');
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
async function saveUpdates(answer) {
    const params = {
      TableName: tableName,
      Key: {
        questionId: answer.questionId
      }
    };

  
    // Retrieve the current answersInfo array from the database
    const getAnswersInfo = dynamodb.get(params).promise();
    const currentAnswersInfo = await getAnswersInfo;
    console.log(currentAnswersInfo)
    console.log(currentAnswersInfo.answersInfo)
    
    console.log(currentAnswersInfo.Item.answersInfo)
    const answersInfo = currentAnswersInfo.Item.answersInfo
    console.log(answersInfo)
    if (answersInfo === 0) {
        console.error('The currentAnswersInfo array is empty');
        return false;
    }
    // Find the index of the answer to update within the currentAnswersInfo array
    // const answerIdNumber = parseInt(answer.answerId)
    console.log(answer.answerId)
    const index = answersInfo.find(a => a.answerId === answer.answerId);
    console.log(index)
    if (index != null) {
      // Update the rating of the answer in the local array
      console.log(index.rating)
      index.rating = answer.rating.toString();
  
      // Update the answersInfo attribute in the database
      const updateParams = {
        TableName: tableName,
        Key: {
          questionId: answer.questionId
        },
        UpdateExpression: 'SET answersInfo = :newAnswersInfo',
        ExpressionAttributeValues: {
          ':newAnswersInfo': {
            M: answersInfo
          }
        }
      };
  
      return await dynamodb
        .update(updateParams)
        .promise()
        .then(() => {
          return true;
        })
        .catch(error => {
          console.error('There is an error saving question: ', error);
        });
    } else {
      console.error('Answer not found');
      return false;
    }
  }

module.exports.updateAnswer = updateAnswer;