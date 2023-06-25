const util = require('../utils/util')
const auth = "test"

//creating function to verify if the user is logged in correctly
function verify(requestBody) {
    if (!requestBody.user || !requestBody.user.username || !requestBody.token) { //if there isnt a user logged in with the correct information it returns an error
        return util.buildResponse( 401, {
            verified: false,
            message: 'incorrect request body'
        })
    }
    //initializing info
    const user = requestBody.user;
    const token = requestBody.token;
    const verification = auth.verifyToken(user.username, token); //if the user is not verified then it will return an error
    if(!verification.verified) {
        return util.buildResponse(401, verification);
    }

    return util.buildResponse(200, {
        verified: true,
        message: 'sucess',
        user: user,
        token: token
    })
}

module.exports.verify = verify;