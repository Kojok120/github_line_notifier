const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const repositoryManager = require('./repositoryManager');
const lineClient = require('./lineClient');

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

// GitHub Webhook の署名検証
function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;
  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
  const body = JSON.stringify(req.body);
  const digest = 'sha256=' + hmac.update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

router.post('/', async (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.headers['x-github-event'];
  const payload = req.body;
  let actionMessage = '';

  // 例として push と pull_request イベントのみ処理
  if (event === 'push') {
    const repoName = payload.repository.full_name;
    actionMessage = `${repoName} で push がありました。`;
  } else if (event === 'pull_request') {
    const repoName = payload.repository.full_name;
    const action = payload.action;
    actionMessage = `${repoName} でプルリクエスト (${action}) がありました。`;
  } else {
    return res.sendStatus(200);
  }

  // 登録ユーザーに通知
  const affectedUsers = repositoryManager.getUsersByRepo(payload.repository.html_url);
  for (const userId of affectedUsers) {
    await lineClient.pushMessage(userId, actionMessage);
  }

  res.sendStatus(200);
});

module.exports = router;
