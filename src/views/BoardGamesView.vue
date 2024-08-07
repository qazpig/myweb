<template>
  <div class="board-games">
    <header class="header">
      <h1>桌遊評論天地</h1>
    </header>
    <div class="container">
      <main class="main-content">
        <div v-for="game in filteredGames" :key="game.id" class="game-card">
          <img :src="game.image" :alt="game.title" />
          <div class="game-info">
            <div class="game-title">{{ game.title }}</div>
            <div class="game-meta">
              玩家人數: {{ game.players }} | 遊戲時長: {{ game.duration }} |
              難度: {{ game.difficulty }}
            </div>
            <p>{{ game.description }}</p>
            <router-link :to="`/blog/${game.id}`" class="read-more"
              >閱讀更多</router-link
            >
          </div>
        </div>
      </main>
      <aside class="sidebar">
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
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useArticle } from "../methods/useArticles";

const { articles, loadArticles } = useArticle();

// 載入文章（這裡假設所有桌遊相關的文章）
loadArticles();

// 遊戲類型和難度等級
const gameTypes = ["策略", "家庭", "派對", "合作"];
const difficultyLevels = ["入門", "中等", "專家"];

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

// 過濾遊戲
const filteredGames = computed(() => {
  return articles.value.filter((game) => {
    const typeMatch =
      activeFilters.value.type.length === 0 ||
      activeFilters.value.type.includes(game.type);
    const difficultyMatch =
      activeFilters.value.difficulty.length === 0 ||
      activeFilters.value.difficulty.includes(game.difficulty);
    return typeMatch && difficultyMatch;
  });
});
</script>

<style scoped>
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