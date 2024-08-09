<template>
  <div class="blog-view">
    <WebHeader />
    <div class="container">
      <BlogPost :postId="$route.params.id"></BlogPost>

      <aside class="sidebar">
        <h3>最近文章</h3>
        <ul>
          <li v-for="post in latestArticles" :key="post.id">
            <router-link :to="'/blog/' + post.id">
              {{ post.title }}</router-link
            >
          </li>
        </ul>
        <p>This area is reserved for future features and content.</p>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import WebHeader from "../components/WebHeader.vue";
import BlogPost from "../components/BlogPost.vue";
import { useArticleStore } from "@/stores/articleStore";

const articleStore = useArticleStore();
const latestArticles = computed(() => articleStore.articles.slice(0, 5));

onMounted(() => {
  articleStore.fetchArticles();
});
</script>

<style scoped>
header {
  background-color: #d79a2a;
  color: white;
  padding: 20px;
  text-align: center;
}
h1 {
  margin: 0;
}
nav {
  margin-top: 10px;
}
nav a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
}
.container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
main {
  flex: 0 0 70%;
  padding-right: 20px;
}
.sidebar {
  flex: 0 0 30%;
  background-color: #f0f0f0;
  padding: 20px;
}
.post {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
h2 {
  color: #2c3e50;
}
.post-meta {
  color: #7f8c8d;
  font-size: 0.9em;
  margin-bottom: 10px;
}
.rating {
  color: #f1c40f;
  font-size: 1.2em;
}
.date {
  margin-left: 10px;
}
</style>