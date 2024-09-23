// 引入必要的模組
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

// 創建 Express 應用程序
const app = express();

// 使用 body-parser 中間件來解析 JSON 請求體
app.use(bodyParser.json());

// 定義路由：獲取所有文章
app.get('/api/articles', (req, res) => {
  // 使用 SQLite 的 all 方法來獲取所有文章
  db.all('SELECT * FROM articles', (err, rows) => {
    if (err) {
      // 如果有錯誤，返回 500 錯誤
      res.status(500).json({ error: err.message });
      return;
    }
    // 返回查詢結果
    res.json(rows);
  });
});

// 定義路由：獲取單篇文章
app.get('/api/articles/:id', (req, res) => {
  // 使用 SQLite 的 get 方法來獲取特定 ID 的文章
  db.get('SELECT * FROM articles WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      // 如果有錯誤，返回 500 錯誤
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      // 如果找不到文章，返回 404 錯誤
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    // 返回查詢結果
    res.json(row);
  });
});

// 定義路由：創建新文章
app.post('/api/articles', (req, res) => {
  // 從請求體中解構所需的資料
  const { title, content, date, category, rating } = req.body;
  
  // 使用 SQLite 的 run 方法來插入新文章
  db.run('INSERT INTO articles (title, content, date, category, rating) VALUES (?, ?, ?, ?, ?)',
    [title, content, date, category, rating],
    function (err) {
      if (err) {
        // 如果有錯誤，返回 500 錯誤
        res.status(500).json({ error: err.message });
        return;
      }
      // 返回新創建的文章 ID
      res.json({ id: this.lastID });
    }
  );
});

// 設定伺服器監聽的端口
const PORT = 4000;
// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});