//Creating question to database. Waiting on how yash inputs values
// window._config = {
//   api:{
//     invokeUrl: 'https://vqela4nlfk.execute-api.us-west-1.amazonaws.com/beta'
//   }
// }
console.log("adljhjhsdfalkjsd");
const apiUrl = "https://vqela4nlfk.execute-api.us-west-1.amazonaws.com/beta";

console.log("callede")
// document.addEventListener('touchstart', handler, {passive: true});
// document.addEventListener('mousewheel', handler, {passive: true});
// document.addEventListener('touchmove', handler, {passive: true});
console.log()
async function submitQuestion() {
  const title = document.getElementById('title').value;
    const body = document.getElementById('editor').value;
    const author = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");  
  const response = await fetch(apiUrl, {
    mode: 'no-cors',  
    method: "POST",
      headers: {
        "Content-Type": "application/json"
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