<template>
  <div class="blog-view">
    <WebHeader />
    <div class="container">
      <BlogPost :postId="$route.params.id"></BlogPost>

      <aside class="sidebar">
        <h3>最近文章</h3>
        <ul>
          <li v-for="post in recentPosts" :key="post.id">
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

<script>
import { ref, computed, onMounted } from "vue";
import WebHeader from "../components/WebHeader.vue";
import BlogPost from "../components/BlogPost.vue";

export default {
  name: "BlogView", //取名這個Vue的名稱
  components: {
    //本頁所使用的模板
    WebHeader,
    BlogPost,
  },
  setup(){
    const articleList = ref([]);
    const loadArticles = async()=>{
      try{
        const respose = await import('../data/articleList.json');
        articleList.value = respose.default;
      }catch(error){
        console.error('Error loading article list:', error);
      }
    }

    const recentPosts =computed(()=>{
      return articleList.value.slice(0,5);
    })

    onMounted(()=>{
      loadArticles();
    })

    return{
      recentPosts
    }
  }

  // data() {
  //   return {
  //     currentPost: null,
  //   };
  // },
  // computed: {
  //   recentPosts() {
  //     return this.BlogPost.slice(0, 5);
  //   },
  // },

  // methods: {
  //   starClass(rating, n) {
  //     const fullStars = Math.floor(rating);
  //     return {
  //       "fas fa-star": n <= fullStars,
  //       "fas fa-star-half-alt": n > fullStars && n - 0.5 <= rating,
  //       "far fa-star": n > Math.ceil(rating),
  //     };
  //   },

  //   loadPost(id) {
  //     this.currentPost = this.BlogPost.find((post) => post.id === parseInt(id));
  //   },
  // },

  // created() {
  //   const postId = this.$route.params.id;
  //   if (postId) {
  //     this.loadPost(postId);
  //   } else {
  //     this.currentPost = this.BlogPost[0];
  //   }
  // },

  // watch: {
  //   $route(to) {
  //     if (to.params.id) {
  //       this.loadPost(to.params.id);
  //     }
  //   },
  // },
};
</script>

<style scoped>
header {
  background-color: #3498db;
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