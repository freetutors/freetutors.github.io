const tableName = 'Freetutor-Question';
const region = 'us-west-1';
const accessKeyId = 'AKIAS6EY4GUSIUNVYNFB';
const secretAccessKey = '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';

const endpoint = `https://dynamodb.${region}.amazonaws.com/${tableName}/scan`;

const request = new Request(endpoint, {
  method: 'GET',
  headers: new Headers({
    'Content-Type': 'application/json',
    'x-amz-date': new Date().toISOString()
  })
});

fetch(request)
  .then(response => response.json())
  .then(data => {
    console.log('Retrieved items:', data);
  })
  .catch(error => {
    console.error('Error retrieving items:', error);
  });
