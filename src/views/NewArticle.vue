<template>
  <div class="blog-post-editor">
    <h2>{{ fileLoaded ? '編輯文章' : '創建新文章' }}</h2>
    
    <!-- 文件上傳輸入 -->
    <div class="file-upload">
      <input type="file" accept=".md" @change="handleFileUpload" />
      <p v-if="fileLoaded" class="file-loaded-message">文件已加載: {{ loadedFileName }}</p>
    </div>
    
    <form @submit.prevent="saveArticle">
      <!-- 文章標題 -->
      <div class="form-group">
        <label for="title">標題:</label>
        <input v-model="post.title" id="title" required />
      </div>
      
      <!-- 發布日期 -->
      <div class="form-group">
        <label for="date">日期:</label>
        <input v-model="post.date" id="date" type="date" required />
      </div>
      
      <!-- 文章分類 -->
      <div class="form-group">
        <label for="category">分類:</label>
        <input v-model="post.category" id="category" required />
      </div>
      
      <!-- 評分 -->
      <div class="form-group">
        <label for="rating">評分:</label>
        <input v-model="post.rating" id="rating" type="number" step="0.1" min="0" max="5" />
      </div>
      
      <!-- Markdown 編輯器 -->
      <div class="form-group">
        <label for="content">內容:</label>
        <MdEditor v-model="editorText" />
      </div>
      
      <!-- 提交按鈕 -->
      <button type="submit">保存文章</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { MdEditor } from 'md-editor-v3';
import { loadMdFile } from '@/js/mdFileReader';
import 'md-editor-v3/lib/style.css';

// 文章數據
const post = reactive({
  title: '',
  date: '',
  category: '',
  rating: '',
});

// Markdown 編輯器內容
const editorText = ref('');

// 文件加載狀態
const fileLoaded = ref(false);
const loadedFileName = ref('');

/**
 * 處理文件上傳
 * @param {Event} event - 文件上傳事件
 */
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const loadedData = await loadMdFile(file);
      // 更新表單數據
      post.title = loadedData.title;
      post.date = loadedData.date;
      post.category = loadedData.category;
      post.rating = loadedData.rating;
      editorText.value = loadedData.content;
      fileLoaded.value = true;
      loadedFileName.value = file.name;
    } catch (error) {
      console.error('加載文件失敗:', error);
      alert('加載文件失敗，請檢查文件格式是否正確。');
    }
  }
};

/**
 * 保存文章
 */
const saveArticle = () => {
  // 組合 frontmatter 和文章內容
  const frontMatter = `---
title: "${post.title}"
date: "${post.date}"
category: "${post.category}"
rating: ${post.rating}
---`;
  const fullContent = `${frontMatter}\n\n${editorText.value}`;
  
  // 創建 Blob 對象
  const blob = new Blob([fullContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  
  // 創建下載鏈接
  const link = document.createElement('a');
  link.href = url;
  link.download = `${post.title.toLowerCase().replace(/\s+/g, '-')}.md`;
  
  // 觸發下載
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // 清理 URL 對象
  URL.revokeObjectURL(url);
};

// 監聽 editorText 變化，自動保存到 localStorage
watch(editorText, (newContent) => {
  localStorage.setItem('draftContent', newContent);
});

// 組件加載時，嘗試從 localStorage 恢復草稿
const savedDraft = localStorage.getItem('draftContent');
if (savedDraft) {
  editorText.value = savedDraft;
}
</script>

<style scoped>
.blog-post-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.file-upload {
  margin-bottom: 20px;
}

.file-loaded-message {
  color: green;
  margin-top: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="date"],
input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>