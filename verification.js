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

function verifyUser(email, verificationCode) {
    const params = {
      ClientId: clientId,
      Username: email,
      ConfirmationCode: verificationCode,
    };
  
    cognito.confirmSignUp(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        alert('Verification failed. Please try again.');
      } else {
        console.log(data);
        alert('Verification successful! You can now sign in.');
        // Redirect the user to the sign-in page or perform any desired action
      }
    });
  }
  
  document.querySelector('.verification-send').addEventListener('click', function () {
    console.log("clicked")
    const verificationCode = this.value;
    const email = 'YOUR_USER_EMAIL'; // Replace with the user's email or retrieve it from your application's state
  
    verifyUser(email, verificationCode);
  });