function buildResponse(statusCode, body) {
    return{
        "statusCode": statusCode,
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        "body": JSON.stringify(body),
        "isBase64Encoded": false
        
    }
}

module.exports.buildResponse = buildResponse;
