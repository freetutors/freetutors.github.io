// import config from "./config.js";
//manually importing config data from json cause ios errors
let data
async function getOptimizeConfig() {
    try {
        const response = await fetch('./optimize.json');
        const json = await response.json();
        data = processJSONData(json);

    } catch (error) {
      console.log(error);
    }
    return data;
}
function processJSONData(data) {
    var data = {
        apiUrlcreate : data.apiUrlcreate,
        apiUrlget  : data.apiUrlget,
        health  : data.health,
        apiUrlupdate  : data.apiUrlupdate,
        apiUrlanswer  : data.apiUrlanswer,
        apiUrlanswerUpdate  : data.apiUrlanswerUpdate,
        apiUrlgetUser  : data.apiUrlgetUser,
        apiUrlupdateUserRating: data.apiUrlupdateUserRating,
        apiUrlupdateAnswerRating: data.apiUrlupdateAnswerRating,
        // Import the necessary AWS SDK components
        poolId  : data.poolId, //getting info from cognito
        clientId  :data.clientId,
        region  : data.region,
        accessKey  : data.accessKey,
        secretKey  : data.secretKey,
    
        apiUrlCreateUser: data.apiUrlCreateUser,
        apiUrlupdateUser: data.apiUrlupdateUser,
        apiUrlupdateUserAnswer: data.apiUrlupdateUserAnswer,
    
        searchHost: data.searchHost,
        searchKey: data.searchKey
    }
    return data
}
var range=[0]
let old
for (const i in range){
    old = await getOptimizeConfig()
}
var config = old


// Import the necessary AWS SDK components
const poolId =config.poolId //getting info from cognito
const clientId = config.clientId
const region = config.region
const accessKey = config.accessKey
const secretKey = config.secretKey

const createUrl = config.apiUrlCreateUser
localStorage.clear();
AWS.config.region = region; //telling what region to search
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ //COnnecting to pool
  IdentityPoolId: poolId 
});

AWS.config.update({
  region: region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey
});

var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy
 //connecting to cognito pool

function signUpUser(params) {
  return new Promise((resolve, reject) => {
    let status = 'incomplete'
  cognito.signUp(params, function(err, data) {
    
    if (err) { 
      console.log(err, err.stack); //if error the user will know if they did something wrong
      if (err.code === 'UsernameExistsException') { //these are checks cognito already does, we will later add the duplicate email check because for some reason it isn't included
        alert("A user with this username already exists.")
      }
      else if(err.code === 'InvalidPasswordException') {
        alert("Password mut be at least 8 characters with at least one capital letter, one lowercase letter, and one special character")
      }
      else if(err.code === 'InvalidParameterException'){
        alert("At least one parameter is invalid.")
      }
      status ='no'
      reject(status)
    } else {
      status = 'ok'
      resolve(status)
    }
  });
  }) //function for signing up, this is already defined
  
}

// checks if user with the same email exists
async function checkExistingUser(email) { //checking for a duplicate email because thats the only one config doesnt autocheck
  const params = { //This is telling what the code should look for(used later)
    AttributesToGet: [ "email" ],
    Filter: `email = "${email}"`, //Pulling users from database based on email adress
    UserPoolId: poolId
 }

 const users = await cognito.listUsers(params).promise(); //this calls the above params and looks for accounts with the same email as the provided one

 if (users && users.Users.length > 0) { //Checks if there are more the zero of said accounts
  const userExists = users.Users.length > 0; //boolean
  return userExists; //returns true(meaning dont make a new account)
} else {
  return false; //allows for new account
}};

document.querySelector('.signup-send'). //finding signup button
addEventListener("click", async () => { //pulling and sending information on click
const username = document.getElementById("username").value; //getting values
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const preferredUsername = 'desired_preferred_username';
    const params = { //organizing all of the data into one constant
    ClientId: clientId, 
    Username: username.trim(), //username and password are the only required ones by default the rest we'll add later
    Password: password,
    UserAttributes: [ //these are the additional atributes we want
      {
        Name: 'email',
        Value: email.trim() //trimming for easy duplicate detection
      },
      {
        Name: 'preferred_username',
        Value: preferredUsername
      },
      {
        Name: 'name',
        Value: name
      },
    ]
  }

    if (password == confirmPassword){
      try {
        const userExists = await checkExistingUser(email); //this is what checks the email address
    
        if (userExists) {
          alert('An account with the same email already exists.'); //will tell user if the funtion returns true
        } else {
          var status = await signUpUser(params); //Signing up users
          console.log(status)
          const response = await fetch(createUrl, { //sending user to database
            mode: 'cors',
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username.trim().toLowerCase()
            })
          });
          if (response.ok) {
            const data = await response.json();
            console.log(data)
            console.log(status)
            setTimeout(() => {
              if (status == "ok"){
                window.location='/verification'
              }
            }, 1000);
          } else {
            alert("Error signing up, try again later")
            console.log("Error calling API");
          }
          localStorage.setItem("signupEmail", email);
          localStorage.setItem("signupUsername", username);
  
        }
      } catch (error) {
        console.log('Error:', error); //giving us error details if something happens
      }
    }
    else {
      alert("Passwords do not match")
    }
});

