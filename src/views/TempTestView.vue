<template>
  <div class="gsap-demo">
    <h1>GSAP 高級動畫示例</h1>

    <!-- SVG 動畫 -->
    <div class="demo-section">
      <h2>SVG 動畫</h2>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#3498db" stroke-width="20" ref="circle" />
      </svg>
      <button @click="playSVGAnimation">播放 SVG 動畫</button>
    </div>

    <!-- 文字動畫 -->
    <div class="demo-section">
      <h2>文字動畫</h2>
      <h3 ref="textElement">這是一個很酷的文字動畫效果！</h3>
      <button @click="playTextAnimation">播放文字動畫</button>
    </div>

    <!-- 複雜序列動畫 -->
    <div class="demo-section">
      <h2>複雜序列動畫</h2>
      <div class="box" ref="box"></div>
      <button @click="playComplexAnimation">播放複雜動畫</button>
    </div>

    <!-- ScrollTrigger 動畫 -->
    <div class="demo-section">
      <h2>ScrollTrigger 動畫</h2>
      <div class="scroll-container" ref="scrollContainer">
        <div v-for="n in 5" :key="n" class="scroll-item" :ref="el => { if (el) scrollItems[n] = el }">
          Item {{ n }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const circle = ref(null);
const textElement = ref(null);
const box = ref(null);
const scrollContainer = ref(null);
const scrollItems = ref([]);

// SVG 動畫
const playSVGAnimation = () => {
  gsap.to(circle.value, {
    duration: 2,
    strokeDasharray: '502, 502',
    strokeDashoffset: 0,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true
  });
};

// 文字動畫
const playTextAnimation = () => {
  gsap.to(textElement.value, {
    duration: 2,
    text: {
      value: "GSAP 讓文字動畫變得如此簡單！",
      delimiter: ""
    },
    ease: "none"
  });
};

// 複雜序列動畫
const playComplexAnimation = () => {
  const tl = gsap.timeline();
  tl.to(box.value, { duration: 1, x: 200, rotation: 360, backgroundColor: '#e74c3c' })
    .to(box.value, { duration: 0.5, scale: 1.5, y: 100 })
    .to(box.value, { duration: 1, x: 0, y: 0, scale: 1, backgroundColor: '#3498db' });
};

// 初始化 ScrollTrigger
onMounted(() => {
  scrollItems.value.forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top bottom-=100",
        end: "top center",
        scrub: true,
        markers: true
      },
      x: index % 2 === 0 ? -200 : 200,
      opacity: 0,
      duration: 1
    });
  });
});
</script>

<style scoped>
.gsap-demo {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
}

button {
  margin-top: 10px;
  padding: 5px 10px;
}

.box {
  width: 50px;
  height: 50px;
  background-color: #3498db;
}

.scroll-container {
  height: 400px;
  overflow-y: scroll;
  border: 1px solid #ccc;
}

.scroll-item {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ecf0f1;
  margin: 10px;
  font-size: 20px;
}
</style>