const Amplify = require(aws-amplify);
Amplify.configure({
    cognito: {
        userPoolId: 'us-west-1_p8Yc1jkno',
        userPoolClientId: '	70fja60algpc90okhqoru49592', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
        region: 'us-west-1' // e.g. us-east-2
    },
    api: {
        invokeUrl: '' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
    }
});