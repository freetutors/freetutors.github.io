const poolId ='us-west-1_p8Yc1jkno' //getting info from cognito
const clientId ='32971sl7929ifogd3f9nbot71q'
const clientSecret = '10gdctfigpivprkpk74l1iqd00tdj3hku581c6i0h78qluf6r44s';
const region = 'us-west-1'

AWS.config.region = region; 
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: poolId 
});

// AWS.config.credentials.get(function() {
//   var cognitoParams = {
//     UserPoolId: 'us-west-1_p8Yc1jkno', // Replace with your actual User Pool ID
//     ClientId: '70fja60algpc90okhqoru49592' // Replace with your actual App Client ID
//   };
//   AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);
//   AWS.config.region = 'us-west-1'; // Replace with your actual region, e.g., 'us-west-2'
// });

var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy

function signUpUser(params) { //function for signing up, this is already defined

  cognito.signUp(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });
}
const cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool({
  UserPoolId: poolId,
  ClientId: clientId
});
document.querySelector('.signup-send'). //finding signup button
addEventListener("click", () => { //pulling and sending information on click
console.log("clicked");  
const username = document.getElementById("username").value; //getting values
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const params = { //organizing all of the data into one constant
    ClientId: clientId, 
    // var secretHash = AWS.util.crypto.sha256(clientId + username + clientSecret);
    // SecretHash: secretHash,
    preffered_username: username, //username and password are the only required ones by default the rest we'll add later
    Password: password,
    // Email: email,
    // Name: name,
    UserAttributes: [ //these are the additional atributes we want
      {
        Name: 'email',
        Value: email
      },
      {
        Name: 'name',
        Value: name
      },
    ]
    };
    console.log(params)
    signUpUser(params); //calling signup function
})