
AWS.config.region = 'us-west-1'; // Replace with your actual region, e.g., 'us-west-2'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-west-1_p8Yc1jkno' // Replace with your actual Identity Pool ID
});

AWS.config.credentials.get(function() {
  var cognitoParams = {
    UserPoolId: 'us-west-1_p8Yc1jkno', // Replace with your actual User Pool ID
    ClientId: '70fja60algpc90okhqoru49592' // Replace with your actual App Client ID
  };
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);
  AWS.config.region = 'us-west-1'; // Replace with your actual region, e.g., 'us-west-2'
});

  var cognito = new AWS.CognitoIdentityServiceProvider();

  function signUpUser(params) {
    var params = {
      ClientId: 'YOUR_CLIENT_ID', // Replace with your actual App Client ID
      Username: 'USERNAME', // Replace with the desired username
      Password: 'PASSWORD' // Replace with the desired password
    };

    cognito.signUp(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
      }
    });
  }

  document.querySelector(".signup-send"). // connecting to login button
  addEventListener("click", async() => { //pulling information on click
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const email = document.getElementById("email").value;
      const name = document.getElementById("name").value;
      const params = { //getting userinfo from 
        ClientId: '70fja60algpc90okhqoru49592',
        Username: username,
        Password: password,
        Email: email,
        Name: name,
      };
      signUpUser(params);
  })