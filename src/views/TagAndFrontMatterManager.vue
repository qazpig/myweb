<template>
  <div class="tag-front-matter-manager">
    <h2>標籤與 Front Matter 管理</h2>

    <!-- 標籤管理部分 -->
    <div class="tag-management">
      <h3>標籤管理</h3>
      <div v-for="category in categories" :key="category" class="category-section">
        <h4>{{ category }} 標籤</h4>
        <div class="tag-buttons">
          <button
            v-for="tag in getTagsByCategory(category)"
            :key="tag"
            class="tag-button"
          >
            {{ tag }}
            <span @click.stop="removeTag(category, tag)" class="delete-tag">✕</span>
          </button>
        </div>
        <div class="add-tag-form">
          <input 
            v-model="newTags[category]" 
            :placeholder="`新增 ${category} 標籤`"
            @keyup.enter="addTag(category)"
          >
          <button @click="addTag(category)">新增</button>
        </div>
      </div>
    </div>

    <!-- Front Matter 管理部分 -->
    <div class="front-matter-management">
      <h3>Front Matter 管理</h3>
      <div v-if="selectedArticle">
        <h4>{{ selectedArticle.title }}</h4>
        <form @submit.prevent="updateFrontMatter">
          <div v-for="field in requiredFields" :key="field" class="form-group">
            <label :for="field">{{ field }}:</label>
            <input 
              :id="field" 
              v-model="frontMatterForm[field]" 
              :type="field === 'date' ? 'date' : 'text'"
              required
            >
          </div>
          <div class="form-group">
            <label for="rating">評分 (可選):</label>
            <input 
              id="rating" 
              v-model.number="frontMatterForm.rating" 
              type="number" 
              min="0" 
              max="5" 
              step="0.1"
            >
          </div>
          <div class="form-group">
            <label>標籤 (可選):</label>
            <div v-for="(tag, index) in frontMatterForm.tags" :key="index" class="tag-input">
              <input v-model="frontMatterForm.tags[index]" type="text">
              <button type="button" @click="removeTagFromForm(index)" class="remove-tag">刪除</button>
            </div>
            <button type="button" @click="addTagToForm" class="add-tag">添加標籤</button>
          </div>
          <button type="submit" class="update-button">更新 Front Matter</button>
        </form>
      </div>
      <div v-else>
        請選擇一篇文章來編輯 Front Matter
      </div>
    </div>

    <!-- 文章選擇部分 -->
    <div class="article-selection">
      <h3>選擇文章</h3>
      <select v-model="selectedArticleId" @change="selectArticle">
        <option v-for="article in articleStore.articles" :key="article.id" :value="article.id">
          {{ article.title }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useArticleStore } from '@/stores/articleStore';

const articleStore = useArticleStore();
const categories = computed(() => {
  const cats = articleStore.getAllCategories;
  return Array.isArray(cats) ? cats : [];
});

const newTags = ref({});
const selectedArticle = ref(null);
const frontMatterForm = ref({});
const selectedArticleId = ref(null);

const requiredFields = ['title', 'date', 'category'];

// 初始化每個分類的新標籤輸入
watch(categories, (newCategories) => {
  newCategories.forEach(category => {
    if (!newTags.value[category]) {
      newTags.value[category] = '';
    }
  });
}, { immediate: true });

// 獲取特定分類的標籤
const getTagsByCategory = (category) => {
  return articleStore.getArticlesByCategory(category)
    .flatMap(article => article.tags || [])
    .filter((tag, index, self) => self.indexOf(tag) === index);
};

// 添加標籤
const addTag = (category) => {
  if (newTags.value[category].trim()) {
    articleStore.addTag(category, newTags.value[category].trim());
    newTags.value[category] = '';
  }
};

// 移除標籤
const removeTag = (category, tag) => {
  articleStore.removeTag(category, tag);
};

// 更新 Front Matter
const updateFrontMatter = () => {
  if (selectedArticle.value) {
    // 移除空標籤
    frontMatterForm.value.tags = (frontMatterForm.value.tags || []).filter(tag => tag.trim() !== '');
    articleStore.updateArticleFrontMatter(selectedArticle.value.id, frontMatterForm.value);
  }
};

// 選擇文章來編輯 Front Matter
const selectArticle = () => {
  const article = articleStore.getArticleById(selectedArticleId.value);
  if (article) {
    selectedArticle.value = article;
    frontMatterForm.value = { ...article };
    if (!Array.isArray(frontMatterForm.value.tags)) {
      frontMatterForm.value.tags = [];
    }
  }
};

// 添加標籤到表單
const addTagToForm = () => {
  if (!Array.isArray(frontMatterForm.value.tags)) {
    frontMatterForm.value.tags = [];
  }
  frontMatterForm.value.tags.push('');
};

// 從表單中移除標籤
const removeTagFromForm = (index) => {
  frontMatterForm.value.tags.splice(index, 1);
};

onMounted(async () => {
  try {
    await articleStore.fetchArticles();
    if (articleStore.articles.length > 0) {
      selectedArticleId.value = articleStore.articles[0].id;
      selectArticle();
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
});
</script>

<style scoped>
.tag-front-matter-manager {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.category-section {
  margin-bottom: 20px;
}

.tag-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.tag-button {
  background-color: #e9e9e9;
  border: none;
  border-radius: 20px;
  padding: 5px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.delete-tag {
  margin-left: 5px;
  color: #ff4444;
  font-weight: bold;
  cursor: pointer;
}

.add-tag-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-tag-form input, .form-group input, select {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-tag-form button, .update-button, .add-tag, .remove-tag {
  padding: 5px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.remove-tag {
  background-color: #ff4444;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.tag-input {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
}

.article-selection {
  margin-top: 20px;
}

h2, h3, h4 {
  color: #333;
}
</style>