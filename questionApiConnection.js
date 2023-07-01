//Creating question to database. Waiting on how yash inputs values

console.log("adljhjhsdfalkjsd");
const apiUrlcreate = "https://vqela4nlfk.execute-api.us-west-1.amazonaws.com/beta/create";
const apiUrlget = "https://vqela4nlfk.execute-api.us-west-1.amazonaws.com/beta/get-question";
const health = "https://vqela4nlfk.execute-api.us-west-1.amazonaws.com/beta/health";
console.log("callede")
// document.addEventListener('touchstart', handler, {passive: true});
// document.addEventListener('mousewheel', handler, {passive: true});
// document.addEventListener('touchmove', handler, {passive: true});
console.log()
async function submitQuestion() {
  const title = document.getElementById('title').value;
    const body = document.getElementById('editor').value;
    const author = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");  
    const userToken = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7."+author+".accessToken")
    console.log(userToken)
    const auth = "Bearer" + author
    const response = await fetch(apiUrlcreate, {
      mode: 'cors',  
    method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth
      },
      body: JSON.stringify({
        title:title,
        body: body,
        author: author,
      })
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.log("Error calling API");
    }
  
    // const questionData = {
    //   title: title,
    //   body: body,
    //   author: author
    // };
    // console.log(questionData)
    // try {
    //     const response = await API.post('freetutor-question-gateway', '/create', {
    //       body: questionData
    //     });
    
    //     // Question created successfully
    //     console.log("it worked")
    //   } catch (error) {
    //     // Error occurred while creating the question
    //     console.log(error)
    //   }
}
console.log("got to here")
document.querySelector(".question-send").addEventListener("click", () => {
  console.log("clicked")  
  submitQuestion()
})