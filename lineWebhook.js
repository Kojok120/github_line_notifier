const express = require('express');
const router = express.Router();
const repositoryManager = require('./repositoryManager');
const lineClient = require('./lineClient');

// LINE の Webhook エンドポイント
router.post('/', async (req, res) => {
  const events = req.body.events;
  if (!events || !Array.isArray(events)) {
    return res.sendStatus(400);
  }

  // 各イベントを処理
  for (const event of events) {
    const userId = event.source.userId;
    const message = event.message && event.message.text ? event.message.text.trim() : '';

    // コマンド解析
    if (message.startsWith('登録：')) {
      const repoUrl = message.replace('登録：', '').trim();
      repositoryManager.registerRepository(userId, repoUrl);
      await lineClient.pushMessage(userId, `リポジトリ ${repoUrl} を登録しました。`);
    } else if (message.startsWith('解除：')) {
      const repoUrl = message.replace('解除：', '').trim();
      repositoryManager.unregisterRepository(userId, repoUrl);
      await lineClient.pushMessage(userId, `リポジトリ ${repoUrl} の登録を解除しました。`);
    } else if (message === '一覧') {
      const repos = repositoryManager.getRepositories(userId);
      if (repos.length === 0) {
        await lineClient.pushMessage(userId, '登録されているリポジトリはありません。');
      } else {
        const list = repos.map((repo, index) => `${index + 1}. ${repo}`).join('\n');
        await lineClient.pushMessage(userId, `登録中のリポジトリ:\n${list}`);
      }
    } else if (message === 'ヘルプ') {
      const helpMessage = `使い方は以下の通りです。\n\n通知登録\n「登録：リンク」\n\n通知解除\n「解除：リンク」\n\n通知一覧表示\n「一覧」`;
      await lineClient.pushMessage(userId, helpMessage);
    } else {
      await lineClient.pushMessage(userId, '不明なコマンドです。ヘルプをご覧ください: 「ヘルプ」');
    }
  }

  res.sendStatus(200);
});

module.exports = router;
