const poolId ='us-west-1_w3se6DxlL' //getting info from cognito
const clientId ='lact4vt8ge7lfjvjetu1d3sl7'
const region = 'us-west-1'
const accessKey = "AKIAS6EY4GUSOJWYQPUN"
const secretKey = "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"

AWS.config.region = region; //telling what region to search
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ //COnnecting to pool
  IdentityPoolId: poolId 
});

AWS.config.update({ //getting conection to IAM user
  region: region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey
});

var cognito = new AWS.CognitoIdentityServiceProvider(); //connection to cognito identiy

function loginUser(username, password) { //user auth data
    const authenticationData = {
      Username: username,
      Password: password
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const poolData = { //pool data
        UserPoolId: poolId,
        ClientId: clientId
      };
    
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const userData = { //user data target
        Username: username,
        Pool: userPool
      };
    
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
          // User authentication successful 
          const accessToken = result.getAccessToken().getJwtToken();
          window.accessToken = accessToken //this is globalizing a logged in user in the whole webpage
          console.log('Access Token: ', accessToken);
          window.location="https://freetutors.github.io/"
        },
        onFailure: function(err) {
            if (err.code === 'NotAuthorizedException') {
                alert('Incorrect Password!')
            }
            if (err.code === 'UserNotFoundException') {
                alert('User not found. Check if your username is typed correctly!')
            }
          // User authentication failed
          console.error(err);
        }
      });
    }
    document.querySelector('.login-send').addEventListener("click", function(e){
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        loginUser(username, password);
    }) 
