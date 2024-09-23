// 引入 sqlite3 模組，並使用 verbose() 方法來啟用詳細的錯誤訊息
const sqlite3 = require('sqlite3').verbose();

// 創建一個新的資料庫連線，如果檔案不存在，它會被自動創建
const db = new sqlite3.Database('./blog.sqlite');

// db.serialize() 確保所有的資料庫操作按順序執行
db.serialize(() => {
  // 創建 articles 表（如果不存在）
  db.run(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT, // 自動遞增的主鍵
    title TEXT,                           // 文章標題
    content TEXT,                         // 文章內容
    date TEXT,                            // 發布日期
    category TEXT,                        // 文章分類
    rating REAL                           // 評分
  )`);

  // 創建 tags 表（如果不存在）
  db.run(`CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT, // 自動遞增的主鍵
    name TEXT UNIQUE                      // 標籤名稱（唯一）
  )`);

  // 創建 article_tags 關聯表（如果不存在）
  db.run(`CREATE TABLE IF NOT EXISTS article_tags (
    article_id INTEGER,                   // 文章 ID
    tag_id INTEGER,                       // 標籤 ID
    FOREIGN KEY(article_id) REFERENCES articles(id), // 外鍵關聯到 articles 表
    FOREIGN KEY(tag_id) REFERENCES tags(id),         // 外鍵關聯到 tags 表
    PRIMARY KEY(article_id, tag_id)       // 複合主鍵
  )`);
});

// 導出資料庫連線，以便在其他文件中使用
module.exports = db;