//this creates tokens. tokens is how you can see if a user is logged in. every logged in user has a different token
const jwt = require('jsonwebtoken');

function generateToken(userInfo) {
    if(!userInfo) {
        return null; //no token if theres no user thats logged in
    }

    return jwt.sign(userInfo, process.env.JWT_SECRET, { //with a encrypted password its good to have an expiration time where the user has to log in again
        //process.env.JWT_SECRET is the secret code for encyrpting each password. NO ONE OUTSIDE OF US SHOULD KNOW THIS
        expiresIn: '5h' //will expire in 5 hours
    })

}

function verifyToken(username, token) { //this is for checking the token
    return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
        if(error) {
            console.log(error)
            return {
                verified: false,
                message: 'invalid token'
            }
        }

        if (response.username !== username) {
            return{
                verified: false,
                message: 'invalid user'
            }

        }

        return{
            verified: true,
            message: 'verified'
        }
    })
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;