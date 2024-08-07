//這個JS是為了整合讀取md檔案的文件所建立
import { ref, computed } from 'vue';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import articleList from '@/data/articleList.json';

// 使用 Vite 的動態導入功能,預加載所有 Markdown 文件
const articleModules = import.meta.glob("/src/assets/article/**/*.md", { as: "raw", });


//這應該是我要丟出去的方法
export function useArticle() {
  // 創建 MarkdownIt 實例
  const md = new MarkdownIt();
  // 創建響應式引用
  const articles = ref([]);
  const loading = ref(true);
  const error = ref(null)

  // 加載單個文章的函數
  const loadArticle = async (articleInfo) => {
    try {
      const modulePath = `/src/assets/article/${articleInfo.path}`;
      if (modulePath in articleModules) {
        const rawContent = await articleModules[modulePath]();
        const { data, content: markdownComtent } = matter(rawContent);

        return {
          ...data,
          id: articleInfo.id,
          content: markdownComtent,
          renderedContent: md.render(markdownComtent)
        };
      }
      throw new Error("沒找到文章");
    } catch (e) {
      console.error('error loading article:', e);
      throw e;
    }
  };

  //加載多個文章的方法
  const loadArticles = async (count = articleList.length) => {
    loading.value = true;
    error.value = null;
    try {
      // 使用 Promise.all 並行加載多個文章
      const loadedArticles = await Promise.all(
        articleList.slice(0, count).map(loadArticle)
      );
      articles.value = loadedArticles;
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };


  //計算屬性：獲取最新文章
  const latestArticles = computed(()=>articles.value.slice(0,3))

  return{
    articles,
    latestArticles,
    loading,
    error,
    loadArticles,
    loadArticle
  }

}
