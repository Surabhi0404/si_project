const express = require('express');
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.post("/api/translate", (req, res) => {


  var subscriptionKey = "0fc93ad66bc1494a8fc37f460b7b5551";
  var endpoint = "https://api.cognitive.microsofttranslator.com/";

  // Add your location, also known as region. The default is global.
  // This is required if using a Cognitive Services resource.
  var location = "eastus";

  axios({
    baseURL: endpoint,
    url: "/translate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Ocp-Apim-Subscription-Region": location,
      "Content-type": "application/json",
      "X-ClientTraceId": uuidv4().toString(),
    },
    params: {
      "api-version": "3.0",
      from: "en",
      to: ["de", "it"],
    },
    data: [
      {
        text: "Hello World!",
      },
    ],
    responseType: "json",
  }).then(function (response) {
    res.json(response.data, null, 4);
  });
});
app.listen(port, () => {
  console.log(`API deployed on ${port}`);
});
