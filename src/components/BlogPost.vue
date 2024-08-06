<template>
  <article class="blog-post" v-if="post">
    <h1>{{ post.title }}</h1>
    <div class="post-meta">
      <span class="date">{{ post.date }}</span>
      <span class="category">{{ post.category }}</span>
      <span class="rating">Rating: {{ post.rating }}/5</span>
    </div>
    <div v-if="content">
      <VueMarkdown :source="content" />
    </div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else> Loading</div>
  </article>
</template>

<script>
import { ref, onMounted } from 'vue'
import  VueMarkdown  from 'vue-markdown-render'
// import articleList from '../data/articleList.json';

export default {
  name: 'BlogPost',
  components: {
    VueMarkdown
  },
  props: {
    postId: {
      type: String,
      required: true
    }

  },
  setup(props) {
    // vue3 的組合API
    const post = ref(null)
    //新增響應式引用
    const content = ref('')
    const error = ref(null)
    
    //組件掛載時執行
    onMounted(async () => {
      try {
        //動態導入文章列表
        const articleList = await import('../data/articleList.js')
        //根據ID找到對應文章
        post.value = articleList.default.find(article => article.id === props.postId)


        if (post.value) {
          const module = await import(`../assets/article/${post.value.path}`)
          content.value = module.default
        }else{
          error.value = "沒找到文章"
        }
      } catch (e) {
        console.error('Error loading article:', e)
        error.value = e.message
      }
    })

    return {
      post,
      content,
      error
    }
  }
}
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