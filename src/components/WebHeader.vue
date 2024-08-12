<template>
  <header>
    <h1>{{ title }}</h1>
    <nav>
      <router-link v-for="link in navLinks" :key="link.to" :to="link.to">
        {{ link.text }}
      </router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'WebHeader',
  props: {
    title: {
      type: String,
      default: 'My Review Blog'
    }
  },
  data() {
    return {
      navLinks: [
        { to: '/', text: 'Home' },
        { to: '/blog', text: 'Blog' },
        { to: '/edu', text: 'Edu'},
        { to: '/movies', text: 'Movies' },
        { to: '/anime', text: 'Anime' },
        { to: '/boardgame', text: 'Board Games' },
        { to: '/escapegames', text: 'Escape Games' }
      ]
    }
  }
}
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