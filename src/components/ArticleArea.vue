<template>
  <div class="article-area">
    <div v-if="loading">加載中...</div>
    <div v-else-if="error">載入文章時發生錯誤：{{ error }}</div>
    <article v-else-if="article" class="single-article">
      <h1>{{ article.title }}</h1>
      <div class="meta">
        <span v-if="article.author" class="author">by {{ article.author }}</span>
      </div>
      <div v-if="article.tags" class="tags">
        <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="content">
        <MdPreview :modelValue="article.content" />
      </div>
      <router-link :to="'.'" class="back-to-list">回到文章列表</router-link>
    </article>
    <div v-else>未找到文章</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useArticleStore } from "@/stores/articleStore";
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const route = useRoute();
const articleStore = useArticleStore();
const article = ref(null);
const loading = ref(true);
const error = ref(null);

const loadArticle = async () => {
  loading.value = true;
  error.value = null;
  try {
    const id = route.params.id;
    article.value = await articleStore.fetchArticleById(id);
    if (!article.value) {
      throw new Error('文章未找到');
    }
  } catch (e) {
    console.error('加載文章時發生錯誤:', e);
    error.value = e.message || '加載文章失敗';
  } finally {
    loading.value = false;
  }
};

onMounted(loadArticle);

// 當路由參數改變時重新加載文章
watch(() => route.params.id, loadArticle);
</script>

<style scoped>
.single-article {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.meta {
  color: #666;
  margin-bottom: 10px;
}

.tags {
  margin-bottom: 20px;
}

.tag {
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 3px;
  margin-right: 5px;
}

.content {
  line-height: 1.6;
  text-align: left;
}
</style>