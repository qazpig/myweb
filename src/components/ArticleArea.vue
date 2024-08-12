<template>
  <article v-if="article" class="single-article">
    <h1>{{ article.title }}</h1>
    <div class="meta">
      <!-- <span class="date">{{ formatDate(article.date) }}</span> -->
      <span v-if="article.author" class="author">by {{ article.author }}</span>
    </div>
    <div v-if="article.tags" class="tags">
      <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
    <div class="content" v-html="article.renderedContent"></div>
  </article>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useArticleStore } from '@/stores/articleStore';
// import { formatDate } from '@/utils/dateFormatter'; // 假設我們有一個日期格式化工具

const route = useRoute();
const articleStore = useArticleStore();
const article = ref(null);

const loadArticle = async () => {
  const id = route.params.id;
  console.log(id)
  article.value = await articleStore.fetchArticleById(id);
  console.log(id)
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
}
</style>