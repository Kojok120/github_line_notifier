require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const lineWebhook = require('./lineWebhook');
const githubWebhook = require('./githubWebhook');

const app = express();

// JSON のパース
app.use(bodyParser.json());

// LINE と GitHub 用のルートを登録
app.use('/webhook/line', lineWebhook);
app.use('/webhook/github', githubWebhook);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
