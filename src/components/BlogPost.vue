<template>
  <article class="blog-post" v-if="post">
    <h1>{{ post.title }}</h1>
    <p>{{ postId }}</p>
    <div class="post-meta">
      <span class="date">{{ post.date }}</span>
      <span class="category">{{ post.category }}</span>
      <span class="rating">Rating: {{ post.rating }}/5</span>
    </div>
    <div v-html="renderedContent"></div>

    <!-- 除錯使用 -->
    <!-- <div v-if="debugInfo">debugInfo: {{ debugInfo }}</div>
    <div v-else-if = "error">Error:{{ error }}</div>
    <div v-else>Loading</div>
    -->

    <!-- <pre v-if="debugInfo"> debugInfo = {{ debugInfo }}</pre>
    <pre v-if="content"> Content: {{content.substring(0,100)}}</pre> -->
  </article>
</template>

<script setup>
import { onMounted,defineProps, toRef } from "vue";
import { useArticleStore } from "@/stores/articleStore";

// // 添加这个 polyfill
// if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
//   window.Buffer = {
//     from: function(str) {
//       return str;
//     }
//   };
// }

const props = defineProps({
  postId: String,
});
const postId = toRef(props,'postId')

const articleStore = useArticleStore();

console.log(postId)
console.log(postId.value)

const post = articleStore.fetchArticleById(postId.value);
console.log(post)


onMounted(async() => {
  // articleStore.fetchArticleById(postId);
  await articleStore.fetchArticleById(postId.value);
  console.log(post)
});
</script>

<style scoped>
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post-meta {
  color: #666;
  margin-bottom: 20px;
}

.post-meta span {
  margin-right: 15px;
}
</style>