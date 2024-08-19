<template>
  <div class="blog-post-editor">
    <h2>Create New Blog Post</h2>
    <form @submit.prevent="createMarkdownFile">
      <div class="form-group">
        <label for="title">Title:</label>
        <input v-model="post.title" id="title" required />
      </div>
      <div class="form-group">
        <label for="date">Date:</label>
        <input v-model="post.date" id="date" type="date" required />
      </div>
      <div class="form-group">
        <label for="category">Category:</label>
        <input v-model="post.category" id="category" required />
      </div>
      <div class="form-group">
        <label for="rating">Rating:</label>
        <input
          v-model="post.rating"
          id="rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
        />
      </div>

      <div class="form-group">
        <label for="content">Content:</label>
        <MdEditor v-model="editorText" ></MdEditor>
      </div>
      <button type="submit">Create Markdown File</button>
    </form>
    <!-- 添加錯誤消息顯示 -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import {  reactive, ref } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

// import MarkdownIt from "markdown-it";
// const md = new MarkdownIt();


const editorText = ref("# Hello");

//reactive 管理表單數據
const post = reactive({
  title: "",
  date: "",
  category: "",
  rating: "",
  content: "",
});

// 使用 ref 來管理錯誤消息
const errorMessage = ref("");

// 創建 Markdown 文件的主函數
async function createMarkdownFile() {
  const frontMatter = `---
title: "${post.title}"
date: "${post.date}"
category: "${post.category}"
rating: ${post.rating}
---
`;
  //組合起完整的MD內容
  const markdownContent = frontMatter + editorText.value;
  console.log(editorText);
  console.log(markdownContent);
  try {
    //使用File Sstem Access API
    await saveWithFileSystem(markdownContent);
  } catch (error) {
    console.error("File System Access API failed:", error);
    // 如果 File System Access API 失敗，退回到下載方法
    downloadMarkdownFile(markdownContent);
  }
  // console.log(markdownContent);
}

//使用File system Access API保存檔案
async function saveWithFileSystem(content) {
  //瀏覽器是否支援
  if (!("showSaveFilePicker" in window)) {
    throw new Error("不支援此API");
  }

  try {
    //顯示文件選擇器，用戶選擇保存位置與文件名
    const handle = await window.showSaveFilePicker({
      suggestedName: `${post.title.toLowerCase().replace(/\s+/g, "-")}.md`,
      types: [
        {
          description: "Markdown Files",
          accept: { "text/markdown": [".md"] },
        },
      ],
    });

    // 創建可寫流
    const writable = await handle.createWritable();

    // 寫入內容
    await writable.write(content);

    // 關閉流
    await writable.close();

    console.log("File saved successfully");
    errorMessage.value = ""; // 清除任何之前的錯誤消息
  } catch (err) {
    console.error("Error saving file:", err);
    errorMessage.value = "Failed to save file. Please try again.";
    throw err; // 重新拋出錯誤，以觸發下載備用方案
  }
}

// 備用方法：生成可下載的 Markdown 文件
function downloadMarkdownFile(content) {
  // 創建一個 Blob 對象
  const blob = new Blob([content], { type: "text/markdown" });

  // 創建一個臨時的 URL
  const url = URL.createObjectURL(blob);

  // 創建一個臨時的 <a> 元素
  const link = document.createElement("a");
  link.href = url;
  link.download = `${post.title.toLowerCase().replace(/\s+/g, "-")}.md`;

  // 模擬點擊下載
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  console.log("File download initiated");
  errorMessage.value = ""; // 清除任何之前的錯誤消息
}
</script>

<style scoped>
.blog-post-editor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.editor-preview-container {
  display: flex;
  gap: 20px;
  margin-bottom: 1rem;
}

.editor,
.preview {
  flex: 1;
  min-height: 400px;
}

.preview {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  overflow-y: auto;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>