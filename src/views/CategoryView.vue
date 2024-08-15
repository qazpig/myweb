<template>
  <div class="category-view">
    <!-- 渲染 WebHeader 組件，傳遞 categoryData 作為 prop -->
    <WebHeader :category="categoryData"></WebHeader>
    <!-- 動態渲染當前視圖組件，傳遞 category 和 articleId 作為 props -->
    <component
      :is="currentView"
      :category="categoryData"
      :articleId="articleId"
    />
  </div>
</template>

<script setup>
import { computed, defineProps, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import { getArticleCategoryById } from "@/data/articleCategories";
import WebHeader from "@/components/WebHeader.vue";
// import BoardGamesView from './BoardGamesView.vue';
// import MoviesView from './MoviesView.vue';
// import AnimeView from './AnimeView.vue';
// import EscapeGamesView from './EscapeGamesView.vue';
// import EducationView from './EducationView.vue';

const route = useRoute();
const props = defineProps(["category", "articleID"]);

// 計算屬性：根據 category prop 獲取分類數據
const categoryData = computed(() => getArticleCategoryById(props.category));
// 計算屬性：獲取文章 ID，優先使用 prop，否則使用路由參數
const articleId = computed(() => props.articleID || route.params.id);

// 計算屬性：動態導入當前視圖組件
const currentView = computed(() => {
  // 獲取視圖名稱，如果不存在則默認使用 BoardGamesView
  const viewName = categoryData.value?.view || "BoardGamesView";
  
  // 使用 defineAsyncComponent 動態導入組件
  return defineAsyncComponent(() => import(`./${viewName}.vue`));
});
</script>