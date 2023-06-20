const poolId ='us-west-1_w3se6DxlL' //getting info from cognito
const clientId ='lact4vt8ge7lfjvjetu1d3sl7'
const region = 'us-west-1'
const accessKey = "AKIAS6EY4GUSOJWYQPUN"
const secretKey = "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"

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
AWS_SDK_LOAD_CONFIG=1
 //connecting to cognito pool

function signUpUser(params) { //function for signing up, this is already defined

  cognito.signUp(params, function(err, data) {
    
    if (err) {
      console.log(err, err.stack);
      if (err.code === 'UsernameExistsException') { //these are checks cognito already does, we will later add the duplicate email check because for some reason it isn't included
        alert("A user with this username already exists.")
      }
      else if(err.code === 'InvalidPasswordException') {
        alert("Password mut be at least 8 characters with at least one capital letter, one lowercase letter, and one special character")
      }
    } else {
      console.log(data);
    }
  });
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
console.log("clicked");  
const username = document.getElementById("username").value; //getting values
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const preferredUsername = 'desired_preferred_username';
    const params = { //organizing all of the data into one constant
    ClientId: clientId, 
    Username: username, //username and password are the only required ones by default the rest we'll add later
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
      try {
      const userExists = await checkExistingUser(email); //this is what checks the email address
  
      if (userExists) {
        alert('An account with the same email already exists.'); //will tell user if the funtion returns true
      } else {
        signUpUser(params); //Signing up users
      }
    } catch (error) {
      console.log('Error:', error); //giving us error details if something happens
    }
});