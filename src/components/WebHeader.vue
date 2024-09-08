<template>
  <div>
    <header
      class="header"
      :style="{ backgroundColor: currentTheme.headerColor }"
    >
      <h1>{{ category.name || props.title }}</h1>
      <nav>
        <router-link v-for="link in navLinks" :key="link.to" :to="link.to">
          {{ link.text }}
        </router-link>
      </nav>
    </header>
  </div>
</template>


<script setup>
import { ref, defineProps, computed } from "vue";
import { articleCategories } from "@/data/articleCategories";

const props = defineProps({
  title: {
    type: String,
    default: "噗噗的文章泥巴",
  },
  category: {
    type: Object,
    default: () => ({}),
  },
});

const currentTheme = computed(() => {
  const category = articleCategories.find(
    (category) => category.id === props.category.id
  );
  return category ? category.theme : {};
});

const navLinks = ref([
  { to: "/", text: "Home" },
  // { to: "/blog", text: "Blog" },
  { to: "/edu", text: "Edu" },
  { to: "/movie", text: "Movies" },
  { to: "/anime", text: "Anime" },
  { to: "/boardgame", text: "Board Games" },
  { to: "/escapegame", text: "Escape Games" },
]);
</script>

<style scoped>
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

nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>