const express = require("express");
const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const config = require("config");
app.use(bodyParser.json());

app.post("/api/translate", (req, res) => {
  axios({
    baseURL: config.get("translator.endpoint"),
    url: "/translate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": config.get("translator.subscriptionKey"),
      "Ocp-Apim-Subscription-Region": config.get("translator.location"),
      "Content-type": "application/json",
      "X-ClientTraceId": uuidv4().toString(),
    },
    params: {
      "api-version": "3.0",
      from: "en",
      to: req.body.to,
    },
    data: [
      {
        text: req.body.text,
      },
    ],
    responseType: "json",
  })
    .then(function (response) {
      res.json(response.data, null, 4);
    })
    .catch((err) => {
      res.status(200).send(err);
    });
});

app.post("/api/detect", (req, res) => {
  axios({
    baseURL: config.get("translator.endpoint"),
    url: "/detect",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": config.get("translator.subscriptionKey"),
      "Ocp-Apim-Subscription-Region": config.get("translator.location"),
      "Content-type": "application/json",
      "X-ClientTraceId": uuidv4().toString(),
    },
    params: {
      "api-version": "3.0",
    },
    data: [
      {
        text: req.body.text,
      },
    ],
    responseType: "json",
  })
    .then(function (response) {
      res.json(response.data[0].language, null, 4);
    })
    .catch((err) => {
      res.status(200).send(err);
    });
});

app.listen(port, () => {
  console.log(`API deployed on ${port}`);
});
