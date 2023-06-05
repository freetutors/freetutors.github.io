//setting login button to redirect
document.querySelector(".login-button").
addEventListener("click", () => {
    window.location='login.html'
}); 
//setting signup button to redirect
document.querySelector(".signup-button").
addEventListener("click", () => {
    window.location='signup.html'
});

// serverside
const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
// initiallized all of the things to check idk why health is there but it is

const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');
const util = require('./utils/util');//this is for a common return function we can use from file to file
// connecting to other codes, for giving each item a seperate function
export const handler = async(event) => { 
    console.log('Request Event: ', event);
    let response;
    switch(true){ // Checking if it is a get or post method This is a giant if statement
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200); // 200=sucess so that means everything went well
            break;
          
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody); //register() defined in register.js
            break;
            
        case event.httpMethod === 'POST' && event.path === loginPath:
            response = util.buildResponse(200);
            break;  
            
        case event.httpMethod === 'POST' && event.path === verifyPath:
            response = util.buildResponse(200);
            break;
        default:
            response = util.buildResponse(404, '404 Not Found')
    }
    return response;
};

