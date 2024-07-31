<template>
  <div>
    <WebHeader/>
    
    <div class="container">
      <main>
        <article class="post">
          <h2>{{ post.title }}</h2>
          <div class="post-meta">
            <span class="rating">
              <i v-for="n in 5" :key="n" :class="starClass(n)"></i>
            </span>
            <span class="date">{{ post.date }}</span>
          </div>
          <p v-for="(paragraph, index) in post.content" :key="index">{{ paragraph }}</p>
        </article>
      </main>
      <aside class="sidebar">
        <h3>Future Development Space</h3>
        <p>This area is reserved for future features and content.</p>
      </aside>
    </div>
  </div>
</template>

<script>
import  WebHeader  from "@/components/WebHeader.vue";
export default {
  components:{
    WebHeader
  },
  name: 'BlogView',
  data() {
    return {
      post: {
        title: 'Inception: A Mind-Bending Experience',
        rating: 4.5,
        date: '2023-05-15',
        content: [
          'Inception is a masterpiece of modern cinema that challenges the viewer\'s perception of reality. Christopher Nolan\'s direction combined with a stellar cast led by Leonardo DiCaprio creates a thrilling and thought-provoking experience. The film\'s intricate plot, stunning visuals, and haunting soundtrack come together to form a truly unforgettable cinematic journey.',
          'As the characters delve deeper into layers of dreams, the audience is taken on a mind-bending adventure that questions the nature of reality and the power of ideas. The film\'s exploration of the subconscious mind and the concept of shared dreaming opens up fascinating philosophical questions about the nature of reality and the human mind.',
          'While the complex narrative may require multiple viewings to fully grasp, the film\'s emotional core – Cobb\'s struggle to return to his children – grounds the story and provides a human element amidst the high-concept sci-fi elements. This balance of intellectual stimulation and emotional resonance is what sets Inception apart as a true masterpiece of contemporary cinema.'
        ]
      }
    }
  },
  methods: {
    starClass(n) {
      const rating = Math.floor(this.post.rating);
      return {
        'fas fa-star': n <= rating,
        'fas fa-star-half-alt': n > rating && n - 0.5 <= this.post.rating,
        'far fa-star': n > Math.ceil(this.post.rating)
      }
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
.container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
main {
  flex: 0 0 70%;
  padding-right: 20px;
}
.sidebar {
  flex: 0 0 30%;
  background-color: #f0f0f0;
  padding: 20px;
}
.post {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
h2 {
  color: #2c3e50;
}
.post-meta {
  color: #7f8c8d;
  font-size: 0.9em;
  margin-bottom: 10px;
}
.rating {
  color: #f1c40f;
  font-size: 1.2em;
}
.date {
  margin-left: 10px;
}
</style>