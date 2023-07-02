//Creating question to database. Waiting on how yash inputs values

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'link', 'image'], // Customize the toolbar elements here
  // Additional toolbar options...
];
if (window.location == "createQuestion.html") {
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
  
  document.querySelector(".question-send").addEventListener("click", () => {
    submitQuestion()
  })
}

const apiUrlcreate = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/create";
const apiUrlget = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/getquestion";
const health = "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/health";

async function submitQuestion() {
  const title = document.getElementById('title').value;
    const body = quill.root.innerHTML;
    const author = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");  
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
  
}

//getting for home page
var desiredSubject = "math" //depending on what column it is on, it will get the questions

async function getQuestionList(desiredSubject) {
  const questionList = await fetch(apiUrlget + "?subject=" + desiredSubject, +  {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then(response => response.json());
  console.log(questionList)
  return questionList
}

async function showQuestionColumn(){
  var desiredSubject = "math"
  const questionList = getQuestionList(desiredSubject)
  console.log(questionList)
  questionList.forEach(question => {
    var title = question.title
    var author = question.author
    var answers = question.answers
    var rating = question.rating
    var time = question.timestamp
    var views = question.views
    document.querySelector(".questions_list").innerHTML += 
      `<div class="box text_box">
      <!-- pfp -->
      <img id="text_box_pfp" src="placeholder_pfp.png">
      <div id="text_box_question_content">${title}</div>
      <div id="asked_by_line">asked by ${author} ${time} ago</div>
      <div id="answered_by_line">answered by abraham_lincoln27, asdfghjkl;, yoyoman, and 2 others</div>
      <div class="question_stats">
        <div id="question_stats_items">10 Answers</div>
        <div id="question_stats_items">${views}</div>
        <div id="question_stats_items">${rating}</div>
      </div>`
    }
  )
}

if (window.location == "index.html" || "/") {
  showQuestionColumn()
}

