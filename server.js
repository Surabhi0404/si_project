const express = require("express");
const axios = require("axios").default;
const { v4: uuidv4, stringify } = require("uuid");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const config = require("config");
app.use(bodyParser.json());

//translation + detection
app.post("/api/translate", (req, res) => {
  var translate = [
    {
      detectedLanguage: {},
      translations: [{}],
    },
  ];
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
      to: req.body.to,
      profanityAction: "Marked",
    },
    data: [
      {
        text: req.body.text,
      },
    ],
    responseType: "json",
  })
    .then(function (response) {
      for (var i = 0; i < response.data.length; i++) {
        translate[0].detectedLanguage.language =
          response.data[0].detectedLanguage.language;
        translate[0].detectedLanguage.score =
          response.data[0].detectedLanguage.score;
        translate[0].translations = response.data[i].translations;
      }
      console.log(response.data[0]);
      res.status(200).json(translate, null, 4);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//detection
app.post("/api/detect", (req, res) => {
  var detect = [
    {
      language: "",
      score: "",
      alternatives: [
        {
          language: "",
          score: "",
        },
      ],
    },
  ];
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
      console.log(response.data.alternatives);
      for (var i = 0; i < response.data.length; i++) {
        detect[i].language = response.data[i].language;
        detect[i].score = response.data[i].score;
        if (response.data[i].alternatives) {
          detect[i].alternatives[i].language =
            response.data[i].alternatives[i].language;
          detect[i].alternatives[i].score =
            response.data[i].alternatives[i].score;
        }
      }
      res.status(200).json(detect, null, 4);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Get positioning of sentence boundaries
app.post("/api/break_sentence", (req, res) => {
  var sentLen = [
    {
      sent: "",
    },
  ];
  var breakSentence = [
    {
      sentLen: [],
    },
  ];
  axios({
    baseURL: config.get("translator.endpoint"),
    url: "/breaksentence",
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
      for (var i = 0; i < response.data[0].sentLen.length; i++) {
        sentLen[i] =
          "Sentence " + [i + 1] + " : " + response.data[0].sentLen[i];
      }
      for (var i = 0; i < response.data.length; i++) {
        breakSentence[i].detectedLanguage = response.data[0].detectedLanguage;
        breakSentence[i].sentLen = sentLen;
      }
      res.status(200).json(breakSentence, null, 4);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Phonetic translation --> Transliteration
app.post("/api/transliterate", (req, res) => {
  axios({
    baseURL: config.get("translator.endpoint"),
    url: "/transliterate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": config.get("translator.subscriptionKey"),
      "Ocp-Apim-Subscription-Region": config.get("translator.location"),
      "Content-type": "application/json",
      "X-ClientTraceId": uuidv4().toString(),
    },
    params: {
      "api-version": "3.0",
      language: req.body.language,
      fromScript: req.body.fromScript,
      toScript: req.body.toScript,
    },
    data: [
      {
        text: req.body.text,
      },
    ],
    responseType: "json",
  })
    .then(function (response) {
      res.status(200).json(response.data, null, 4);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Get alternate translations for given text
app.post("/api/alt_translations", (req, res) => {
  axios({
    baseURL: config.get("translator.endpoint"),
    url: "/dictionary/lookup",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": config.get("translator.subscriptionKey"),
      "Ocp-Apim-Subscription-Region": config.get("translator.location"),
      "Content-type": "application/json",
      "X-ClientTraceId": uuidv4().toString(),
    },
    params: {
      "api-version": "3.0",
      from: req.body.from,
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
      res.status(200).json(response.data, null, 4);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.listen(port, () => {
  console.log(`API deployed on ${port}`);
});
