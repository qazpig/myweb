<template>
  <div class="home">
    <WebHeader></WebHeader>

    <div class="container">
      <aside class="left-sidebar">
        <h2>Left Sidebar</h2>
        <p>Future content area</p>
      </aside>
      <main>
        <h2>Latest Reviews</h2>
        <div v-for="post in latestPosts" :key="post.id" class="post-preview">
          <h3>{{ post.title }}</h3>
          <div class="post-meta">
            <span class="rating">
              <i v-for="n in 5" :key="n" :class="starClass(post.rating, n)"></i>
            </span>
            <span class="date">{{ post.date }}</span>
          </div>
          <div v-html="truncateHTMl(post.content, 200)"></div>
          <router-link :to="'/blog/' + post.id" class="read-more"
            >Read more</router-link
          >
        </div>
      </main>
      <aside class="right-sidebar">
        <h2>Right Sidebar</h2>
        <p>Future content area</p>
      </aside>
    </div>
  </div>
</template>

<script>
import WebHeader from "../components/WebHeader.vue";
import articleList from "../data/articleList.json";

export default {
  components: {
    WebHeader,
  },
  name: "HomeView",
  data() {
    return {
      latestPosts: articleList.slice(0, 3),
    };
  },
  methods: {
    starClass(rating, n) {
      const fullStars = Math.floor(rating);
      return {
        "fas fa-star": n <= fullStars,
        "fas fa-star-half-alt": n > fullStars && n - 0.5 <= rating,
        "far fa-star": n > Math.ceil(rating),
      };
    },
    truncateHTMl(html, maxlength) {
      const div = document.createElement("div");
      div.innerHTML = html;
      const text = div.textContent || div.innerHTML || "";
      if (text.length <= maxlength) {
        return html;
      }
      let truncated = text.substring(0, maxlength);
      if (truncated.lastIndexOf(" ") > 0) {
        truncated = truncated.substring(0, truncated.lastIndexOf(" "));
      }
      return truncated + "...";
    },
  },
};
</script>

<style scoped>
.home {
  font-family: Arial, sans-serif;
}

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
  flex: 0 0 50%;
  padding: 0 20px;
}

.left-sidebar,
.right-sidebar {
  flex: 0 0 25%;
  background-color: #f0f0f0;
  padding: 20px;
}

.post-preview {
  background-color: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h2,
h3 {
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
  margin-right: 10px;
}

.read-more {
  display: inline-block;
  margin-top: 10px;
  color: #3498db;
  text-decoration: none;
}

.read-more:hover {
  text-decoration: underline;
}
</style>