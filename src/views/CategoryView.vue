<template>
  <component 
    :is="currentView" 
    :category="categoryData"
    :articleId="articleId"
  />
</template>

<script setup>
import { computed,defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { getArticleCategoryById } from '@/data/articleCategories';
import BoardGamesView from './BoardGamesView.vue';
// import MoviesView from './MoviesView.vue';
// import AnimeView from './AnimeView.vue';
// import EscapeGamesView from './EscapeGamesView.vue';
// import EducationView from './EducationView.vue';

const props = defineProps(['category','articleID']);
const route = useRoute();

const categoryData = computed(() => getArticleCategoryById(props.category));
const articleId = computed(()=>props.articleID||route.params.id)

// const articleId = computed(() => route.params.id);

const viewComponents = {
  BoardGamesView,
  // MoviesView,
  // AnimeView,
  // EscapeGamesView,
  // EducationView
};

const currentView = computed(() => {
  return viewComponents[categoryData.value?.view] || BoardGamesView;
});
</script>