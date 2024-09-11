<template>
  <BaseView :category="props.category" :articleId="props.articleId">
    <template #article-list>
      <div v-for="game in boardGames" :key="game.id" class="game-card">
        <!-- <img :src="game.image" :alt="game.title" /> -->
        <div class="game-info">
          <div class="game-title">{{ game.title }}</div>
          <div class="game-meta">
            玩家人數: {{ game.players }} | 遊戲時長: {{ game.duration }} | 難度:
            {{ game.difficulty }}
          </div>
          <p>{{ game.description }}</p>
          <div class="game-preview">
            <MdPreview
              :model-value="getPreviewContent(game.content)"
              :previewOnly="true"
            ></MdPreview>
          </div>
          <router-link :to="`/${category.id}/${game.id}`" class="read-more"
            >閱讀更多</router-link
          >
        </div>
      </div>
    </template>
    <template #sidebar-content>
      <div>
        <div class="filter-section">
          <div class="filter-title">遊戲類型</div>
          <div class="filter-options">
            <span
              v-for="type in gameTypes"
              :key="type"
              @click="toggleFilter('type', type)"
              :class="[
                'filter-option',
                { active: activeFilters.type.includes(type) },
              ]"
            >
              {{ type }}
            </span>
          </div>
        </div>
        <div class="filter-section">
          <div class="filter-title">遊戲難度</div>
          <div class="filter-options">
            <span
              v-for="level in difficultyLevels"
              :key="level"
              @click="toggleFilter('difficulty', level)"
              :class="[
                'filter-option',
                { active: activeFilters.difficulty.includes(level) },
              ]"
            >
              {{ level }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </BaseView>
</template>



<script setup>
import { ref, onMounted, computed, defineProps } from "vue";
import { useArticleStore } from "@/stores/articleStore";
// import WebHeader from "@/components/WebHeader.vue";
// import ArticleArea from "@/components/ArticleArea.vue";
import BaseView from "../components/BaseView.vue";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

//處理路由
// import { useRoute } from "vue-router";
// const route = useRoute();
// const categoryPath = computed(()=>`/${props.category.id}`) ;

//身為子物件，父物件需要傳遞進來的資訊，也就是手套
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
  articleId: {
    type: String,
    default: null,
  },
});
console.log("props:", props);

const articleStore = useArticleStore();
console.log(articleStore);

const showArticle = computed(() => !!props.articleId);

// 遊戲類型和難度等級
const gameTypes = ["策略", "家庭", "派對", "合作"];
const difficultyLevels = ["入門", "中等", "專家"];

const boardGames = computed(() => {
  console.log("Category ID:", props.category.id);
  return articleStore.getArticlesByCategory(props.category.id);
});
console.log("Boardgames:", boardGames);

//
onMounted(async () => {
  // console.log("props:",props)
  if (showArticle.value) {
    await articleStore.fetchArticleById(props.articleId);
  } else {
    // await articleStore.fetchArticles(props.category.id);
    console.log("Component mounted, fetching articles...");
    await articleStore.fetchArticles();
    console.log("Articles after fetch:", articleStore.articles);
  }
});

const getPreviewContent = (content) => {
  // console.log('獲取文章內容'+content)
  // 移除 Markdown 語法
  const plainText = content
    .replace(/^#+\s+/gm, "") // 移除標題
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // 移除粗體
    .replace(/(\*|_)(.*?)\1/g, "$2") // 移除斜體
    // .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // 移除鏈接，只保留文本
    .replace(/^>+\s+/gm, "") // 移除引用
    .replace(/^[*-+]\s+/gm, "") // 移除無序列表
    .replace(/^\d+\.\s+/gm, "") // 移除有序列表
    .replace(/`{1,3}[^`\n]+`{1,3}/g, "") // 移除行內代碼
    .replace(/```[\s\S]*?```/g, "") // 移除代碼塊
    // .replace(/!\[([^\]]+)\]\([^\)]+\)/g, "") // 移除圖片
    .trim();

  // // 尋找第一個段落
  // const firstParagraph = plainText.split(/\n\s*\n/)[1];

  // 如果段落太長，截取適當長度
  const maxLength = 300;
  if (plainText.length > maxLength) {
    return plainText.substring(0, maxLength) + "...";
  }

  return plainText;
};

//下方為監聽資訊
// watch(
//   () => articleStore.articles,
//   (newArticles) => {
//     console.log("Articles updated in view:", newArticles);
//   },
//   { immediate: true }
// );

// watch(
//   () => articleStore.loading,
//   (isLoading) => {
//     console.log("Loading status:", isLoading);
//   },
//   { immediate: true }
// );

// watch(
//   () => articleStore.error,
//   (error) => {
//     if (error) {
//       console.error("Error in article store:", error);
//     }
//   },
//   { immediate: true }
// );

// 活動過濾器
const activeFilters = ref({
  type: [],
  difficulty: [],
});

// 切換過濾器
const toggleFilter = (category, value) => {
  const index = activeFilters.value[category].indexOf(value);
  if (index > -1) {
    activeFilters.value[category].splice(index, 1);
  } else {
    activeFilters.value[category].push(value);
  }
};
</script>

<style scoped>
/* 確保 MdPreview 在遊戲卡片中有合適的樣式 */
.game-preview {
  max-height: 100px;
  overflow: hidden;
  margin-bottom: 10px;
}

/* 使 MdPreview 的樣式與您的設計保持一致 */
:deep(.md-preview) {
  background-color: transparent;
  padding: 0;
}

.board-games {
  font-family: Arial, sans-serif;
  background-color: #f5e6d3;
  color: #333;
}

.header {
  background-color: #8b4513;
  color: white;
  padding: 20px;
  text-align: center;
}

.container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.main-content {
  flex: 3;
}

.sidebar {
  flex: 1;
  margin-left: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
}

.game-card {
  background-color: white;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.game-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
}

.game-info {
  margin-top: 10px;
}

.game-title {
  font-size: 1.2em;
  font-weight: bold;
}

.game-meta {
  font-size: 0.9em;
  color: #666;
}

.read-more {
  display: inline-block;
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #8b4513;
  color: white;
  text-decoration: none;
  border-radius: 3px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
}

.filter-option {
  background-color: #e6ccb3;
  padding: 5px 10px;
  margin: 2px;
  border-radius: 3px;
  font-size: 0.9em;
  cursor: pointer;
}

.filter-option.active {
  background-color: #8b4513;
  color: white;
}
</style>