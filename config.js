
var config = {
    apiUrlcreate : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/create",
    apiUrlget  : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/getquestion",
    health  : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/health",
    apiUrlupdate  : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/updatequestion",
    apiUrlanswer  : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/createanswer",
    apiUrlanswerUpdate  : "https://k4zqq0cm8d.execute-api.us-west-1.amazonaws.com/beta/updateanswer",
    apiUrlgetUser  : "https://d487bezzog.execute-api.us-west-1.amazonaws.com/beta/get",
    // Import the necessary AWS SDK components
    poolId  :'us-west-1_w3se6DxlL', //getting info from cognito
    clientId  :'lact4vt8ge7lfjvjetu1d3sl7',
    region  : 'us-west-1',
    accessKey  : "AKIAS6EY4GUSOJWYQPUN",
    secretKey  : "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",

    apiUrlCreateUser: "https://d487bezzog.execute-api.us-west-1.amazonaws.com/beta/create"

    // apiUrlcreate: window._env_.apiUrlcreate,
    // apiUrlget: window._env_.apiUrlget,
    // health: window._env_.health,
    // apiUrlupdate: window._env_.apiUrlupdate,
    // apiUrlanswer: window._env_.apiUrlanswer,
    // apiUrlanswerUpdate: window._env_.apiUrlanswerUpdate,
    // apiUrlgetUser: window._env_.apiUrlgetUser,
    // poolId: window._env_.poolId,
    // clientId: window._env_.clientId,
    // region: window._env_.region,
    // accessKey: window._env_.accessKey,
    // secretKey: window._env_.secretKey,
    // apiUrlCreateUser: window._env_.apiUrlCreateUser,
}

// export default config;