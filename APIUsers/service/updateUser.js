const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
const fs = require('fs')
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Freetutor-Users' // connection to database and user table

const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder

async function updateUser(updateBody) {
    console.log(updateBody)
    const pfp = updateBody.pfp
    const about = updateBody.about
    const questions = parseInt(updateBody.questions) //body with formatting
    const answers = parseInt(updateBody.answers) 
    console.log(answers)
    const username = updateBody.username
    if (pfp != null){
        console.log(pfp)
        const user = {
            username: username,
            pfp: pfp
        }
        await savepfp(user)
        const response = {
            user: user,
            pfp: pfp
        }
        return util.buildResponse(200, response);
    }
    else if (about != null){
        console.log(about)
        const user = {
            username: username,
            about: about
        }
        await saveabout(user)
        const response = {
            user: user,
            about: about
        }
        return util.buildResponse(200, response);
    }
    else if (questions != null){
        console.log(questions)
        const user = {
            username: username,
            questions: questions
        }
        await savequestions(user)
        const response = {
            user: user,
            questions: questions
        }
        return util.buildResponse(200, response);
    }
    else if (answers != null){
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

}
async function savepfp(user){ //saving new users to database
    const params = {
        TableName: tableName,
        Key: {
            username: user.username
        }
    ,
    UpdateExpression: 'SET #pfp = :pfp',
    ExpressionAttributeNames: {
      '#pfp': 'pfp',
    },
    ExpressionAttributeValues: {
      ":pfp": user.pfp
    }
  };
    return await dynamodb.update(params).promise().then(() => {
        return true;
    }, error =>{
        console.error('There is an error saving question: ', error)
    });
}
async function saveabout(user){ //saving new users to database
    const params = {
        TableName: tableName,
        Key: {
            username: user.username
        }
    ,
    UpdateExpression: 'SET #about = :about',
    ExpressionAttributeNames: {
      '#about': 'about',
    },
    ExpressionAttributeValues: {
      ":about": user.about
    }
  };
    return await dynamodb.update(params).promise().then(() => {
        return true;
    }, error =>{
        console.error('There is an error saving question: ', error)
    });
}
async function savequestions(user){ //saving new users to database
    const params = {
        TableName: tableName,
        Key: {
            username: user.username
        }
    ,
    UpdateExpression: 'SET #questions = :questions',
    ExpressionAttributeNames: {
      '#questions': 'questions',
    },
    ExpressionAttributeValues: {
      ":questions": user.questions
    }
  };
    return await dynamodb.update(params).promise().then(() => {
        return true;
    }, error =>{
        console.error('There is an error saving question: ', error)
    });
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
        console.error('There is an error saving question: ', error)
    });
}
module.exports.updateUser = updateUser;