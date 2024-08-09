<template>
  <div class="new-article-view">
    <h2>新增文章</h2>
    <form @submit.prevent="createArticle">
      <div class="form-group">
        <label for="title">標題:</label>
        <input id="title" v-model="article.title" required>
      </div>
      
      <div class="form-group">
        <label for="category">分類:</label>
        <select id="category" v-model="article.category" required>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="date">日期:</label>
        <input id="date" v-model="article.date" type="date" required>
      </div>
      
      <div class="form-group">
        <label for="tags">標籤:</label>
        <div class="tag-input">
          <input 
            id="tags" 
            v-model="newTag"
            @keyup.enter.prevent="addTag"
            placeholder="輸入標籤後按 Enter"
          >
          <button type="button" @click="addTag">新增標籤</button>
        </div>
        <div class="tag-list">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            {{ tag }}
            <button type="button" @click="removeTag(tag)" class="remove-tag">✕</button>
          </span>
        </div>
      </div>
      
      <div class="form-group">
        <label for="content">內容:</label>
        <textarea id="content" v-model="article.content" rows="10" required></textarea>
      </div>
      
      <button type="submit" class="submit-button">新增文章</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useArticleStore } from '@/stores/articleStore';
// import { useArticle } from '@/composables/useArticles';
import { useRouter } from 'vue-router';

const articleStore = useArticleStore();
// const { loadArticle } = useArticle();
const router = useRouter();

const article = ref({
  title: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  tags: [],
  content: ''
});

const categories = computed(() => articleStore.getAllCategories);
const newTag = ref('');

const addTag = () => {
  if (newTag.value.trim() && !article.value.tags.includes(newTag.value.trim())) {
    article.value.tags.push(newTag.value.trim());
    newTag.value = '';
  }
};

const removeTag = (tag) => {
  article.value.tags = article.value.tags.filter(t => t !== tag);
};

const createArticle = async () => {
  try {
    // 在这里，你需要实现保存新文章的逻辑
    // 这可能涉及将文章内容写入 Markdown 文件，并更新 articleStore
    
    // 模拟保存文章的过程
    console.log('Saving new article:', article.value);
    
    // 更新 articleStore
    await articleStore.addArticle(article.value);
    
    // 重新加载文章列表
    await articleStore.fetchArticles();
    
    // 导航到新创建的文章页面或文章列表
    router.push({ name: 'BlogList' });
  } catch (error) {
    console.error('Error creating article:', error);
    // 这里可以添加错误处理逻辑，比如显示错误消息给用户
  }
};
</script>

<style scoped>
.new-article-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.tag-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background-color: #e9e9e9;
  padding: 5px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
}

.remove-tag {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  margin-left: 5px;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>