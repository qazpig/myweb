<template>
  <div class="blog-admin">
    <h2>添加新文章</h2>
    <form @submit.prevent="addNewPost">
      <div>
        <label for="title">標題：</label>
        <input id="title" v-model="newPost.title" required>
      </div>
      <div>
        <label for="category">分類：</label>
        <input id="category" v-model="newPost.category" required>
      </div>
      <div>
        <label for="rating">評分：</label>
        <input id="rating" v-model.number="newPost.rating" type="number" min="0" max="5" step="0.5" required>
      </div>
      <div>
        <label for="content">內容：</label>
        <textarea id="content" v-model="newPost.content" required></textarea>
      </div>
      <button type="submit">添加文章</button>
    </form>
  </div>
</template>

<script>
import articleList from '../data/articleList.json'

export default {
  name: 'BlogAdminView',
  data() {
    return {
      newPost: {
        title: '',
        category: '',
        rating: 0,
        content: ''
      }
    }
  },
  methods: {
    addNewPost() {
      const post = {
        id: Date.now(), // 使用當前時間戳作為臨時 ID
        date: new Date().toISOString().split('T')[0], // 當前日期
        ...this.newPost
      }
      
      // 添加新文章到數組
      articleList.unshift(post)
      
      // 在實際應用中，這裡應該發送請求到服務器來保存數據
      // 這裡我們模擬保存到 localStorage
      localStorage.setItem('articleList', JSON.stringify(articleList))
      
      // 重置表單
      this.newPost = {
        title: '',
        category: '',
        rating: 0,
        content: ''
      }
      
      alert('文章已添加！')
    }
  }
}
</script>

<style scoped>
.blog-admin {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

form > div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
}

textarea {
  height: 200px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>