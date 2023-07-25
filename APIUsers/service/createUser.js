const AWS = require('aws-sdk'); // dasf
const fs = require('fs')
const path = require('path')
AWS.config.update({
    region: 'us-west-1'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Freetutor-Users' // connection to database and user table

const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder

async function createUser(userdata) {
    const username = userdata.username //body with formatting
    const timestamp = new Date().toISOString();
    const defaultPic = path.join(__dirname, "placeholder_pfp.png")
    const about = ""
    const status = ""
    const imageBuffer = fs.readFileSync(defaultPic)
    let profilePictureBase64 = imageBuffer.toString("base64")
    
    const user = { //question details
        username: username, //so we can pull it later
        questions: 0,
        answers: 0,
        pfp: profilePictureBase64,
        timestamp: timestamp,
        about: about,
        status: status
    }
    await saveQuestion(user)
    const response = {
        user: user,
        username: username
    }
    return util.buildResponse(200, response);
}
async function saveQuestion(user){ //saving new users to database
    const params = {
        TableName: tableName,
        Item: user
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error =>{
        console.error('There is an error saving question: ', error)
    });
}

module.exports.createUser = createUser;