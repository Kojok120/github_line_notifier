// ユーザーごとのリポジトリ情報を保持（キー：userId、値：Set(リポジトリ URL)）
const userRepositories = {};

// リポジトリ登録
function registerRepository(userId, repoUrl) {
  if (!userRepositories[userId]) {
    userRepositories[userId] = new Set();
  }
  userRepositories[userId].add(repoUrl);
}

// リポジトリ解除
function unregisterRepository(userId, repoUrl) {
  if (userRepositories[userId]) {
    userRepositories[userId].delete(repoUrl);
  }
}

// 登録リポジトリ一覧取得
function getRepositories(userId) {
  if (!userRepositories[userId]) return [];
  return Array.from(userRepositories[userId]);
}

// 指定リポジトリを登録しているユーザー一覧を取得
function getUsersByRepo(repoUrl) {
  const users = [];
  for (const userId in userRepositories) {
    if (userRepositories[userId].has(repoUrl)) {
      users.push(userId);
    }
  }
  return users;
}

module.exports = {
  registerRepository,
  unregisterRepository,
  getRepositories,
  getUsersByRepo
};
