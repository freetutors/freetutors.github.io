import { API, Amplify } from './node_modules/aws-amplify';

const environmentName = 'staging'; // Replace this with your desired environment name
const appId = 'dzouxhnq74cxx'; // Replace this with your Amplify App ID
const envDetails = await Amplify.API.getEnvDetails(environmentName, appId);
const secretValue = envDetails[0].envVars['apiUrlCreate'];
console.log(secretValue)

var config = {
    apiUrlcreate: window._env_.apiUrlcreate,
    apiUrlget: window._env_.apiUrlget,
    health: window._env_.health,
    apiUrlupdate: window._env_.apiUrlupdate,
    apiUrlanswer: window._env_.apiUrlanswer,
    apiUrlanswerUpdate: window._env_.apiUrlanswerUpdate,
    apiUrlgetUser: window._env_.apiUrlgetUser,
    poolId: window._env_.poolId,
    clientId: window._env_.clientId,
    region: window._env_.region,
    accessKey: window._env_.accessKey,
    secretKey: window._env_.secretKey,
    apiUrlCreateUser: window._env_.apiUrlCreateUser,
}
console.log(config)
export default config;