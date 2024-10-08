// serverside
const healthPath = '/health'; //checking for healthy service connection, mainly for bug fix and testing
const createPath = '/create';
const getPath = '/get';
const updatePath = '/update';
const updateAnswerPath = '/updateanswer';
// initiallized all of the things to check 

const createService = require('./service/createUser.js');
const getService = require('./service/getUser.js');
const updateService = require('./service/updateUser.js')
const updateAnswerService = require('./service/updateUserAnswer.js')
const util = require('./utils/util');//this is for a common return function we can use from file to file

// connecting to other codes for giving each item a seperate function

exports.handler = async(event) => { 
    console.log(event.httpMethod , event.path)
    console.log('Request Event: ', event);
    let response;
    switch(true){ // Checking if it is a get or post method This is a giant if statement
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200); // 200=sucess so that means everything went well
            break;
          
        case event.httpMethod === 'POST' && event.path === createPath:
            const createBody = JSON.parse(event.body);
            response = await createService.createUser(createBody); //register() defined in register.js all the other functions are done the same way in the service folder
            break;
        case event.httpMethod === 'GET' && event.path === getPath:
            const getBody = JSON.parse(event.body);
            response = await getService.getUser(event);
            break;  
        case event.httpMethod === 'POST' && event.path === updatePath:
            const updateBody = JSON.parse(event.body);
            response = await updateService.updateUser(updateBody); //register() defined in register.js all the other functions are done the same way in the service folder
            break;
        case event.httpMethod === 'POST' && event.path === updateAnswerPath:
            const updateAnswerBody = JSON.parse(event.body);
            response = await updateAnswerService.updateUserAnswers(updateAnswerBody); //register() defined in register.js all the other functions are done the same way in the service folder
            break;
        
        default:
            response = util.buildResponse(404, '404 Not Found')
    }
    return response;
};

