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
async function checkExistingUser(email) {
  const params = {
    AttributesToGet: [ "email" ],
    Filter: `email = "${email}"`,
    UserPoolId: poolId
 }
 const testparams = {
  UserPoolId: poolId
 }
 const test = await cognito.listUsers(params);
 console.log(test)
 const users = await cognito.listUsers(params).promise();
 console.log(users);

 if (users && users.Users.length > 0) {
  const userExists = users.Users.length > 0;

  return userExists;
} else {
  return false;
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
        Value: email.trim()
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
      const userExists = await checkExistingUser(email);
  
      if (userExists) {
        alert('An account with the same email already exists.');
      } else {
        signUpUser(params);
      }
    } catch (error) {
      console.log('Error:', error);
    }
});