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

function loginUser(username, password) {
    const authenticationData = {
      Username: username,
      Password: password
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const poolData = {
        UserPoolId: poolId,
        ClientId: clientId
      };
    
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const userData = {
        Username: username,
        Pool: userPool
      };
    
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
          // User authentication successful
          const accessToken = result.getAccessToken().getJwtToken();
          // You can use the accessToken for authenticated API calls or other operations
          console.log('Access Token: ', accessToken);
        },
        onFailure: function(err) {
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