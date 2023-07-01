//Creating question to database. Waiting on how yash inputs values
var toolbarOptions = [
  ['bold', 'italic', 'underline', 'link', 'image'], // Customize the toolbar elements here
  // Additional toolbar options...
];

var quill = new Quill('#editor', {
  placeholder: 'Provide any additional relevant details',
  theme: 'snow',
  modules: {
    toolbar: toolbarOptions,
    imageResize: {
      modules: ['Resize']
    },
    imageDrop: true,
  },
});

var previewContainer = document.getElementById('preview-container');
var previewTitleContainer = document.getElementById('preview-container-title');

function updatePreviewBody() {
  var content = quill.root.innerHTML;
  previewContainer.innerHTML = content;
  MathJax.Hub.Queue(['Typeset', MathJax.Hub, previewContainer]);
}

function updatePreviewTitle() {
  var title = document.getElementById('title').value;
  previewTitleContainer.innerHTML = title;
  MathJax.Hub.Queue(['Typeset', MathJax.Hub, previewTitleContainer]);
}

quill.on('text-change', function () {
  updatePreviewBody();
});

console.log("adljhjhsdfalkjsd");
const apiUrlcreate = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/create";
const apiUrlget = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/getquestion";
const health = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/health";
console.log("callede")
// document.addEventListener('touchstart', handler, {passive: true});
// document.addEventListener('mousewheel', handler, {passive: true});
// document.addEventListener('touchmove', handler, {passive: true});
console.log()
async function submitQuestion() {
  const title = document.getElementById('title').value;
    const body = quill.root.innerHTML;
    console.log(body)
    const author = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");  
    console.log(author)
    const userToken = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7."+author+".accessToken")
    console.log(userToken)
    const response = await fetch(apiUrlcreate, {
      mode: 'cors',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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