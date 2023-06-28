//Creating question to database. Waiting on how yash inputs values
// window._config = {
//   api:{
//     invokeUrl: 'https://vqela4nlfk.execute-api.us-west-1.amazonaws.com/beta'
//   }
// }
console.log("adljhjhsdfalkjsd");
import {Amplify} from './node_modules/aws-amplify';
const poolId ='us-west-1_w3se6DxlL' //getting info from cognito
const clientId ='lact4vt8ge7lfjvjetu1d3sl7'
Amplify.configure({
  Auth:{
    region: 'ws-west-1',
    userPoolId: poolId,
    userPoolWebClientId: clientId,
  },
  API: {
    name: 'freetutor-question-gateway',
    endpoint: 'https://vqela4nlfk.execute-api.us-west-1.amazonaws.com/beta'
  }
})
console.log("callede")
const API = window.Amplify.API;
document.addEventListener('touchstart', handler, {passive: true});
document.addEventListener('mousewheel', handler, {passive: true});
document.addEventListener('touchmove', handler, {passive: true});
console.log()
async function submitQuestion() {
    const title = document.getElementById('title').value;
    const body = document.getElementById('editor').value;
    const author = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");
  
    const questionData = {
      title: title,
      body: body,
      author: author
    };
    console.log(questionData)
    try {
        const response = await API.post('freetutor-question-gateway', '/create', {
          body: questionData
        });
    
        // Question created successfully
        console.log("it worked")
      } catch (error) {
        // Error occurred while creating the question
        console.log(error)
      }
    }

    document.getElementById("question-send").addEventListener("click", {passive: true}, () => {
      console.log("clicked")  
      submitQuestion()
    })