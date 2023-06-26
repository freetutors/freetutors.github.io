//Creating question to database. Waiting on how yash inputs values
async function submitQuestion() {
    const title = document.getElementById('title').value;
    const body = document.getElementById('editor').value;
    const author = localhost.getitem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");
  
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

    document.getElementById("question-send").addEventListener("click", () => {
        submitQuestion()
    })