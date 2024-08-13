<template>
  <div class="base-view">
    <header class="header">
      <h1>{{ props.category.name }}</h1>
    </header>
    <div class="container">
      <main class="main-content">
        <div v-if="articleStore.loading">載入中...</div>
        <div v-else-if="articleStore.error">
          錯誤訊息：{{ articleStore.error }}
        </div>
        <ArticleArea v-else-if="showArticle" :category="props.category" :articleId="props.articleId"></ArticleArea>
        <slot v-else name="article-list"></slot>
      </main>
      <aside class="sidebar">
        <slot name="sidebar-content"></slot>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch,defineProps } from "vue";
import { useArticleStore } from "@/stores/articleStore";
import ArticleArea from "@/components/ArticleArea.vue";

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  articleId: {
    type: String,
    default: null
  }
});

const articleStore = useArticleStore();

const showArticle = computed(() => !!props.articleId);

onMounted(async () => {
  if (showArticle.value) {
    await articleStore.fetchArticleById(props.articleId);
  } else {
    await articleStore.fetchArticles(props.category.id);
  }
});

watch(() => articleStore.articles, (newArticles) => {
  console.log('Articles updated in view:', newArticles);
}, { immediate: true });

watch(() => articleStore.loading, (isLoading) => {
  console.log('Loading status:', isLoading);
}, { immediate: true });

watch(() => articleStore.error, (error) => {
  if (error) {
    console.error('Error in article store:', error);
  }
}, { immediate: true });
</script>

<style scoped>
.base-view {
  font-family: Arial, sans-serif;
  background-color: #f5e6d3;
  color: #333;
}

.header {
  background-color: #8b4513;
  color: white;
  padding: 20px;
  text-align: center;
}

.container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.main-content {
  flex: 3;
}

.sidebar {
  flex: 1;
  margin-left: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
}
</style>