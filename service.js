const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

var subscriptionKey = "0fc93ad66bc1494a8fc37f460b7b5551";
var endpoint = "https://api.cognitive.microsofttranslator.com/";

// Add your location, also known as region. The default is global.
// This is required if using a Cognitive Services resource.
var location = "eastus";


axios({
    baseURL: endpoint,
    url: '/dictionary/lookup',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'from': 'en',
        'to': 'es'
    },
    data: [{
        'text': 'shark'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data[0], null, 4));
}).catch((err) => {
    console.log(err);
})