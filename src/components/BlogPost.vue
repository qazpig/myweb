<template>
  <article class="blog-post" v-if="post">
    <h1>{{ post.title }}</h1>
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

<script>
import { ref, computed, onMounted } from "vue";
import MarkdownIt from "markdown-it";
import matter from "gray-matter";
import articleList from "@/data/articleList.json";

// 添加这个 polyfill
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = {
    from: function(str) {
      return str;
    }
  };
}

//vite的import.meta.glob動態導入所有md
const articleModules = import.meta.glob("/src/assets/article/**/*.md", {
  as: "raw",
});

export default {
  name: "BlogPost",
  props: {
    postId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // console.log("組件"+ articleModules)

    //創建markdown實例
    const md = new MarkdownIt();
    const post = ref(null);
    const content = ref("");
    const error = ref(null);
    const debugInfo = ref("");

    //計算屬性將markdown內容渲染為html
    const renderedContent = computed(() => md.render(content.value));

    onMounted(async () => {
      try {
        const articleInfo = articleList.find(
          (article) => article.id === props.postId
        );

        if (articleInfo) {
          const modulePath = `/src/assets/article/${articleInfo.path}`;
          debugInfo.value = `尝试加载文件: ${modulePath}\n`;

          // console.log("可用文章模块:", Object.keys(articleModules));

          if (modulePath in articleModules) {
            const rawContent = await articleModules[modulePath]();
            const { data, content: markdownContent } = matter(rawContent);

            post.value = { ...data, id: props.postId };
            content.value = markdownContent;

            debugInfo.value += `文件加载成功\n`;
            debugInfo.value += `元數據: ${JSON.stringify(data)}\n`;
            debugInfo.value += `内容长度: ${content.value.length}\n`;
          } else {
            error.value = "Article file not found";
            debugInfo.value += `文件未找到: ${modulePath}\n`;
            // debugInfo.value += `可用路径: ${Object.keys(articleModules).join(', ')}\n`;
          }
        } else {
          error.value = "Article not found";
          debugInfo.value = "文章在 articleList 中未找到\n";
        }
      } catch (e) {
        console.error("Error loading article:", e);
        error.value = e.message;
        debugInfo.value += `错误: ${e.message}\n`;
      }
    });

    return {
      post,
      renderedContent,
      error,
      debugInfo,
      // markdownContent
    };
  },
};
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