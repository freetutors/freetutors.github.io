console.log('adsdasf')
import amplifyConfig from './aws-exports'
console.log(amplifyConfig)
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

export default config;
