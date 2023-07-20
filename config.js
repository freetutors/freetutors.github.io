import awsmobile from './aws-exports'
console.log(awsmobile)
const amplifyConfig = awsmobile.amplifyConfig
var config = {
    // apiUrlcreate : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/create",
    // apiUrlget  : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/getquestion",
    // health  : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/health",
    // apiUrlupdate  : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/updatequestion",
    // apiUrlanswer  : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/createanswer",
    // apiUrlanswerUpdate  : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/updateanswer",
    // apiUrlgetUser  : "https://d487bezzog.execute-api.us-west-1.amazonaws.com/beta/get",
    // // Import the necessary AWS SDK components
    // poolId  :'us-west-1_w3se6DxlL', //getting info from cognito
    // clientId  :'lact4vt8ge7lfjvjetu1d3sl7',
    // region  : 'us-west-1',
    // accessKey  : "AKIAS6EY4GUSOJWYQPUN",
    // secretKey  : "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",
    
    // apiUrlCreateUser: "https://d487bezzog.execute-api.us-west-1.amazonaws.com/beta/create"
    apiUrlcreate: window._env_.apiUrlcreate,
    apiUrlget: window._env_.apiUrlget,
    health: amplifyConfig.health,
    apiUrlupdate: amplifyConfig.apiUrlupdate,
    apiUrlanswer: amplifyConfig.apiUrlanswer,
    apiUrlanswerUpdate: amplifyConfig.apiUrlanswerUpdate,
    apiUrlgetUser: amplifyConfig.apiUrlgetUser,
    poolId: amplifyConfig.poolId,
    clientId: amplifyConfig.clientId,
    region: amplifyConfig.region,
    accessKey: amplifyConfig.accessKey,
    secretKey: amplifyConfig.secretKey,
    apiUrlCreateUser: amplifyConfig.apiUrlCreateUser,
}

export default config;
