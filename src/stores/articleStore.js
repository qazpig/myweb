import { defineStore } from "pinia";
import { useArticle } from "@/composables/useArticles";
import { articleCategories } from "@/data/articleCategories";

//導出名為article的store
export const useArticleStore = defineStore('article', {

  //視作為data
  state: () => ({
    articles: [],
    articleCategories: articleCategories,
    loading: false,
    error: null,
  }),


  //視作為compute屬性
  getters: {
    //他返回一個函數，這個函數接受一個id參數
    //他返回的函數使用Array.find()在state.articles查找id
    getArticleById: (state) => (id) => state.articles.find(article => article.id === id) || null,

    getArticlesByCategory: (state) => (category) => {
      return state.articles.filter(article =>
        article.category === category || article.mainCategory === category
      );
    },

    getArticlesByTag: (state) => (tag) => {
      return state.articles.filter(article => article.tags && article.tags.includes(tag));
    },

    getAllTags: (state) => {
      const tagSet = new Set();
      state.articles.forEach(article => {
        if (article.tags) {
          article.tags.forEach(tag => tagSet.add(tag));
        }
      });
      return Array.from(tagSet);
    },

    getAllCategories: (state) => {
      const categorySet = new Set();
      state.articles.forEach(article => {
        if (article.category) categorySet.add(article.category);
        if (article.mainCategory) categorySet.add(article.mainCategory);
      });
      return Array.from(categorySet);
    },
  },
  //視作為方法
  actions: {
    async fetchArticles() {
      this.loading = true;
      this.error = null;
      try {
        // 從 useArticles 中解構出 loadArticles 方法
        const { loadArticles } = useArticle();
        console.log('Calling loadArticles...');
        const fetchedArticles = await loadArticles();
        console.log('Fetched articles:', fetchedArticles);

        // 將獲取的文章數據賦值給 store 的 articles 狀態
        if (Array.isArray(fetchedArticles)) {
          this.articles = fetchedArticles;
        } else {
          console.error('fetchedArticles is not an array:', fetchedArticles);
          throw new Error('fetched articles is not an array')
        }

      } catch (err) {
        console.error('Error in fetchArticles:', err);
        this.error = err.message || '文章加載出錯'
        this.articles = [];
      } finally {
        this.loading = false;
        console.log('Final articles state:', this.articles);
      }
    },

    //可以透過ID加載單篇文章
    async fetchArticleById(id) {
      console.log('進來fetcharticlebyid ID:'+id)
      const existingArticle = this.getArticleById(id);
      if (existingArticle) {
        return existingArticle;
      }
    
      this.loading = true
      this.error = null
      try {
        const { loadArticle, getArticlePath } = useArticle();
        const path = getArticlePath(id);
        console.log(path)
        const article = await loadArticle(path);
        if (article) {
          this.articles.push(article);
          return article
        }
      } catch (err) {
        // 如果發生錯誤，存儲錯誤信息，包含具體的文章 id
        console.error(`Error loading article ${id}:`, err);
        this.error = err.message || `加載文章 ${id} 時出錯`;
      } finally {
        this.loading = false;
      }
    },

    //增加標籤
    addTag(category, tag) {
      const articlesInCategory = this.getArticlesByCategory(category);
      articlesInCategory.forEach(article => {
        if (!article.tags.includes(tag)) {
          article.tags.push(tag);
        }
      });
    },

    removeTag(category, tag) {
      const articlesInCategory = this.getArticlesByCategory(category);
      articlesInCategory.forEach(article => {
        article.tags = article.tags.filter(t => t !== tag);
      });
    },

    updateArticleFrontMatter(id, newFrontMatter) {
      const article = this.getArticleById(id);
      if (article) {
        Object.assign(article, newFrontMatter);
        // 這裡應該添加保存更改到文件系統的邏輯
        console.log(`Updated front matter for article ${id}:`, newFrontMatter);
      }
    }
  }
})