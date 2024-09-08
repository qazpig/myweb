<template>
  <div class="blog-post-editor">
    <h2>Create New Blog Post</h2>
    <form @submit.prevent="createMarkdownFile">
      <!-- 標題和日期區塊 -->
      <div class="form-row">
        <div class="form-group title-group">
          <label for="title">Title:</label>
          <input v-model="post.title" id="title" required />
        </div>
        <div class="form-group date-group">
          <label for="date">Date:</label>
          <input v-model="post.date" id="date" type="date" required />
        </div>
      </div>

      <!-- 類別和評分區塊 -->
      <div class="form-row">
        <div class="form-group category-group">
          <label for="category">Category:</label>
          <select v-model="post.category" id="category" required>
            <option value="">Select a category</option>
            <option value="boardgame">Board Game</option>
            <option value="movie">Movie</option>
            <option value="anime">Anime</option>
            <option value="escapegame">Escape Game</option>
            <option value="education">Education</option>
          </select>
        </div>
        <div class="form-group rating-group">
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
      </div>

      <!-- 標籤選擇區塊 -->
      <div class="form-group">
        <label>標籤：</label>
        <div class="tag-tree">
          <div v-for="category in tagCategories" :key="category" class="tag-category">
            <h3>{{ getCategoryName(category) }}</h3>
            <div v-for="tag in getCategoryTags(category)" :key="tag.id" class="tag-item" :style="{ marginLeft: `${getTagLevel(tag) * 20}px` }">
              <label :class="{ 'parent-tag': !tag.parentId }">
                <input type="checkbox" :value="tag.id" v-model="selectedTags">
                {{ tag.name }}
              </label>
              <button v-if="hasChildren(tag)" @click.prevent="toggleChildren(tag)" class="toggle-btn" type="button">
                {{ isExpanded(tag) ? '−' : '+' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章內容編輯器 -->
      <div class="form-group">
        <label for="content">Content:</label>
        <MdEditor v-model="editorText"></MdEditor>
      </div>

      <!-- 表單操作按鈕 -->
      <div class="form-actions">
        <button type="submit">Create Markdown File</button>
        <button @click.prevent="cleanDraft" type="button">清除草稿</button>
      </div>

    </form>
      <div>
        <button @click="testbutton">測試按鈕</button>
      </div>
    <!-- 錯誤訊息顯示 -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useTagStore } from "@/stores/tagStore";
import { storeToRefs } from "pinia";

// 初始化 tag store
const tagStore = useTagStore();
const { tags } = storeToRefs(tagStore);

// 用於管理文章標籤的響應式引用
const selectedTags = ref([]);

// 用於管理展開的標籤
const expandedTags = ref(new Set());

// 計算屬性：獲取所有標籤類別
const tagCategories = computed(() => [...new Set(tags.value.map(tag => tag.category))]);

// 獲取類別名稱的中文翻譯
const getCategoryName = (category) => {
  const categoryNames = {
    boardgame: '桌遊',
    movie: '電影',
    anime: '動畫',
    escapegame: '密室逃脫',
    education: '教育'
  };
  return categoryNames[category] || category;
};

// 獲取特定類別的標籤
const getCategoryTags = (category) => {
  return tags.value.filter(tag => tag.category === category);
};

// 獲取標籤的層級
const getTagLevel = (tag) => {
  let level = 0;
  let currentTag = tag;
  while (currentTag.parentId) {
    level++;
    currentTag = tags.value.find(t => t.id === currentTag.parentId);
  }
  return level;
};

// 檢查標籤是否有子標籤
const hasChildren = (tag) => {
  return tags.value.some(t => t.parentId === tag.id);
};

// 檢查標籤是否已展開
const isExpanded = (tag) => {
  return expandedTags.value.has(tag.id);
};

// 切換標籤的展開/收起狀態
const toggleChildren = (tag) => {
  if (expandedTags.value.has(tag.id)) {
    expandedTags.value.delete(tag.id);
  } else {
    expandedTags.value.add(tag.id);
  }
};

// 編輯器內容
const editorText = ref("# Hello");

// 表單數據
const post = reactive({
  title: "",
  date: "",
  category: "",
  rating: "",
  content: "",
});

// 錯誤訊息
const errorMessage = ref("");

// 組件掛載時的操作
onMounted(async () => {
  // 從 localStorage 讀取草稿
  const savedDraft = localStorage.getItem("articleDraft");
  if (savedDraft) {
    const parsedDraft = JSON.parse(savedDraft);
    Object.assign(post, parsedDraft);
    editorText.value = parsedDraft.content || "";
    selectedTags.value = parsedDraft.tags || [];
  }
  // 獲取標籤數據
  await tagStore.fetchTags();
});

// 監聽表單變化並保存到 localStorage
watch(
  [post, editorText],
  () => {
    const draftToSave = {
      ...post,
      tags: selectedTags.value,
      content: editorText.value,
    };
    localStorage.setItem("articleDraft", JSON.stringify(draftToSave));
  },
  { deep: true }
);

// 創建 Markdown 文件
async function createMarkdownFile() {
  const frontMatter = `---
title: "${post.title}"
date: "${post.date}"
category: "${post.category}"
tags: [${selectedTags.value.map((id) => `"${tagStore.getTagById(id).name}"`).join(", ")}]
rating: ${post.rating}
---
`;
  const markdownContent = frontMatter + editorText.value;

  try {
    await saveWithFileSystem(markdownContent);
  } catch (error) {
    console.error("File System Access API failed:", error);
    downloadMarkdownFile(markdownContent);
  }
}

// 使用 File System Access API 保存文件
async function saveWithFileSystem(content) {
  if (!("showSaveFilePicker" in window)) {
    throw new Error("不支援此API");
  }
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: `${post.title.toLowerCase().replace(/\s+/g, "-")}.md`,
      types: [
        {
          description: "Markdown Files",
          accept: { "text/markdown": [".md"] },
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    console.log("File saved successfully");
    errorMessage.value = "";
  } catch (err) {
    console.error("Error saving file:", err);
    errorMessage.value = "Failed to save file. Please try again.";
    throw err;
  }
}
function testbutton(){
  console.log(post)
}
// 清理草稿
function cleanDraft() {
  if (confirm("點擊後將刪除暫存文章")) {
    localStorage.removeItem("articleDraft");
    Object.assign(post, {
      title: "",
      date: "",
      category: "",
      rating: "",
    });
    editorText.value = "";
    selectedTags.value = [];
  }
}

// 下載 Markdown 文件（備用方法）
function downloadMarkdownFile(content) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${post.title.toLowerCase().replace(/\s+/g, "-")}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  console.log("File download initiated");
  errorMessage.value = "";
}
</script>

<style scoped>
/* 整體布局 */
.blog-post-editor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

/* 表單布局 */
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

/* 標題和日期 */
.title-group {
  flex: 3;
  display: flex;
  flex-direction: column;
}

.date-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 確保輸入框填滿容器 */
.title-group input,
.date-group input {
  width: 100%;
  box-sizing: border-box;
}

/* 類別和評分 */
.category-group {
  flex: 3;
}

.rating-group {
  flex: 1;
}

/* 標籤和其他表單元素 */
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="date"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

/* 標籤樹結構 */
.tag-tree {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
}

.tag-category {
  flex: 1;
  min-width: 200px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.tag-category h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
}

.tag-item {
  margin: 5px 0;
  display: flex;
  align-items: center;
}

.tag-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.tag-item input[type="checkbox"] {
  margin-right: 5px;
}

.parent-tag {
  font-weight: bold;
  color: #2c3e50;
}

.toggle-btn {
  margin-left: 5px;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 16px;
  color: #666;
  padding: 0 5px;
}

.toggle-btn:hover {
  color: #333;
}

/* 按鈕樣式 */
.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button[type="button"] {
  background-color: #01cb30b8;
}

button[type="button"]:hover {
  background-color: #d32f2f;
}

/* 錯誤訊息 */
.error-message {
  color: #f44336;
  margin-top: 10px;
  font-size: 14px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .title-group,
  .date-group,
  .category-group,
  .rating-group {
    flex: none;
    width: 100%;
  }

  .tag-tree {
    flex-direction: column;
  }

  .tag-category {
    min-width: 100%;
  }
}
</style>