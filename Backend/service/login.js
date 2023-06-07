const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
// getting region set-up and connection to AWS Lambda
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'freetutor-users' // connection to database and user table

const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder
const bcrypt = require('bcryptjs'); // this is for encrypting passwords in our database
const auth = require('../utils/auth')// grabbing token generator
async function login(user) {
    const username = user.username;
    const password = user.password;
    if (!user || !username || !password){ // checking if all fields are filled
        return util.buildResponse(401, {
            message: 'username and password are required'
        })
    }

    const dynamoUser = await getUser(username.toLowerCase().trim());//trimming username so that ' AaRush  ' and 'aarush' are treated the same
    if (!dynamoUser || !dynamoUser.username) { //checking if user exists
        return util.buildResponse(403, {message: 'user does not exist'}) // 403 is a arbitrary error number dont user 200 and 404 because they mean ok and not found respectively
    }

    if (!bcrypt.compareSync(password, dynamoUser.password)) { //checking if entered password matched database
        return util.buildResponse(403, {message: 'password is incorrect'});
    }

    const userInfo = {
        username: dynamoUser.username, //client will get the lowercase and trimmed version which is good
        name: dynamoUser.name
    }
    const token = auth.generateToken(userInfo)//getting token from auth.js in utils folder
    const response = {
        user: userInfo,
        token: token
    }
    return util.buildResponse(200, response);
}

async function getUser(username) { //getting user info to check if the user has already logged in 
    const params = {
        TableName: userTable,
        Key: {
            username: username // on dynamo username is the way data is fetched(thats what I set)
        }
    }

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('There is an error getting user: ', error)// in case of a error we'll know
    })
}

module.exports.login = login;