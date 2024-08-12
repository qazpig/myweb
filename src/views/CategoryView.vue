<template>
  <component 
    :is="currentView" 
    :category="category"
    :articleId="$route.params.id"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getArticleCategoryById } from '@/data/articleCategories';
import BoardGamesView from './BoardGamesView.vue';
import MoviesView from './MoviesView.vue';
import AnimeView from './AnimeView.vue';
import EscapeGamesView from './EscapeGamesView.vue';
import EducationView from './EducationView.vue';

const route = useRoute();
const category = computed(() => getArticleCategoryById(route.params.category));
// const articleId = computed(() => route.params.id);

const viewComponents = {
  BoardGamesView,
  MoviesView,
  AnimeView,
  EscapeGamesView,
  EducationView
};

const currentView = computed(() => {
  return viewComponents[category.value?.view] || BoardGamesView;
});
</script>