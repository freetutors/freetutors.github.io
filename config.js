const environmentName = 'staging';
const appId = 'dzouxhnq74cxx';

// AWS.config.update({
//     region: 'us-west-1', // Replace 'YOUR_AWS_REGION' with the appropriate AWS region, e.g., 'us-east-1'
//   });
// Create an instance of the AWS Systems Manager service
const ssm = new AWS.SSM();

// Construct the parameter name to fetch the secret
const paramName = `/a/amplify/${appId}/${environmentName}/apiUrlCreate`;

// Set up parameters for the GetParameter request
const params = {
  Name: paramName,
  WithDecryption: true, // If the secret is encrypted, set this to true
};

// Fetch the secret value from AWS Systems Manager Parameter Store
ssm.getParameter(params, function(err, data) {
  if (err) {
    console.error('Error fetching secret:', err);
  } else {
    const secretValue = data.Parameter.Value;
    console.log('Secret Value:', secretValue);
    // You can use the secretValue variable in your frontend code as needed
  }
});