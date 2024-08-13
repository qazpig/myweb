//這個JS是為了整合讀取md檔案的文件所建立
import { ref } from 'vue';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import { articleCategories } from '@/data/articleCategories';

// 添加这个 polyfill
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = {
    from: function (str) {
      return str;
    }
  };
}

// 使用 Vite 的動態導入功能,預加載所有 Markdown 文件
const articleModules = import.meta.glob("/src/assets/article/**/*.md", { as: "raw", });
console.log('Article modules:', Object.keys(articleModules));

//這應該是我要丟出去的方法
export function useArticle() {
  // 創建 MarkdownIt 實例
  const md = new MarkdownIt();
  // 創建響應式引用
  const articles = ref([]);
  const loading = ref(true);
  const error = ref(null)


  //FrontMatter 資料檢查
  function validateFrontMatter(frontMatter) {
    const requireFields = ['title', 'date', 'category'];
    const missingFields = requireFields.filter(field => !frontMatter[field]);

    if (missingFields.length > 0) {
      console.warn(`文章缺少下列front matter:${missingFields.join(',')}`);
      return false;
    }

    if (isNaN(Date.parse(frontMatter.date))) {
      console.warn('日期格式錯誤');
      return false;
    }
    return true;
  }

  // 加載單個文章的函數 
  const loadArticle = async (path) => {
    // console.log(path)
    try {
      //加載文章內容
      if (typeof articleModules[path] !== 'function') {
        console.error('Invalid article module:', path);
        return null;
      }

      const rawContent = await articleModules[path]();
      // console.log('Raw content loaded for:', path);
      const { data, content: markdownContent } = matter(rawContent);


      // 驗證 front matter，如果不完整則返回 null
      if (!validateFrontMatter(data)) {
        console.error(`文章${path}的front matter 不完整`);
        return null;
      }
      // const mainCategory = path.split('/')[4];

      // console.log('raw data:', rawContent)
      //返回處理的文章
      return {
        ...data,
        id: path.split('/')[5].slice(0, -3),
        content: markdownContent,
        renderedContent: md.render(markdownContent),
        path
        // rating: data.rating||0,
        // tags: data.tags||[]
      };
    } catch (e) {
      console.error('error loading article:', e);
      throw e;
    }
  };

  //加載多個文章的方法
  const loadArticles = async () => {
    loading.value = true;
    error.value = null;
    try {
      // 使用 Promise.all 並行加載多個文章
      const loadedArticles = await Promise.all(
        Object.keys(articleModules).map(loadArticle)
      );
      console.log('Loaded articles:', loadedArticles);
      articles.value = loadedArticles.filter(article => article !== null);
      return articles.value;
    } catch (e) {
      console.error('Error in loadArticles:', e);
      error.value = e.message;
      return []

    } finally {
      loading.value = false;
    }
  };

  //找到路徑
  const getArticlePath = (id) =>{
    // const categories = ['boardgames', 'movies', 'anime', 'escapegames'];
    for (const category of articleCategories) {
      const path = `/src/assets/article/${category.id}/${id}.md`;
      if (articleModules[path]) {
        return path;
      }
    }
    throw new Error(`Article with id ${id} not found`);
  }

  const getArticlesByCategory = (category) => {
    // 定義按類別獲取文章的函數
    return articles.value.filter(article =>
      article.category === category || article.mainCategory === category
    );
  };

  const getArticlesByTag = (tag) => {
    // 定義按標籤獲取文章的函數
    return articles.value.filter(article => article.tags.includes(tag));
  };


  return {
    articles,
    // latestArticles,
    loading,
    error,
    loadArticles,
    loadArticle,
    getArticlesByCategory,
    getArticlesByTag,
    getArticlePath
  }

}
