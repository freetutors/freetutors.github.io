const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-1'
})
// getting region set-up and connection to AWS Lambda
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'freetutor-users' // connection to database and user table

const util = require('../utils/util'); // every period shows how much higher you have to go on file levels. this has to periods because u have to go outside of the folder, one means that is in the same folder
const bcrypt = require('bcryptjs'); // this is for encrypting passwords in our database

async function register(userInfo) {
    const name = userInfo.name;
    const username = userInfo.username;
    const email = userInfo.email;
    const grade = userInfo.grade;
    const password = userInfo.password; // All of the info in sign ups has been set
    if (!username || !name || !email || !password || !grade) { //checking for all categories filled, || = or
        return util.buildResponse(401, { // any arbitrary error number works BUT NOT 200 or 404
            message: 'All fields are required'
        })
    }

    const dynamoUser = await getUser(username.toLowerCase().trim()); //the username Aarush and aarush will be considered the same for simplicity and better function
    if (dynamoUser && dynamoUser.username) { //checking if the username is unique
        return util.buildResponse(401, {
            message: 'username already exists in our database, please choose a different username'
        })
    }

    const encryptedPW = bcrypt.hashSync(password.trim(), 10);//eliminating white space at the start and begining with .trim with 10 rounds of encyrption
    const user = {
        name: name,
        username: username.toLowerCase().trim(),
        email: email,
        grade: grade,
        password: encryptedPW
    }

    const saveUserResponse = await saveUser(user);
    if (!saveUserResponse) {
        return util.buildResponse(503, {message: 'Server Error. Please try again later'}) //if something goes wrong this will appear
    }

    return util.buildResponse(200, {username: username}); //200 = success for now its returning the username
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

async function saveUser(user){ //saving new users to database
    const params = {
        TableName: userTable,
        Item: user
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error =>{
        console.error('There is an error saving user: ', error)
    });
}

module.exports.register = register;