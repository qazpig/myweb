<template>
  <div class="blog-post-editor">
    <h2>Create New Blog Post</h2>
    <form @submit.prevent="createMarkdownFile">
      <div>
        <label for="title">Title:</label>
        <input v-model="post.title" id="title" required />
      </div>
      <div>
        <label for="date">Date:</label>
        <input v-model="post.date" id="date" type="date" required />
      </div>
      <div>
        <label for="category">Category:</label>
        <input v-model="post.category" id="category" required />
      </div>
      <div>
        <label for="rating">Rating:</label>
        <input
          v-model="post.rating"
          id="rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
        />
      </div>
      <div class="editor-preview-container">
        <div class="editor">
          <label for="content">Content:</label>
          <textarea
            v-model="post.content"
            id="content"
            rows="20"
            required
          ></textarea>
        </div>
        <div class="preview">
          <h3>Preview</h3>
          <div v-html="renderedContent"></div>
        </div>
      </div>
      <button type="submit">Create Markdown File</button>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import MarkdownIt from "markdown-it";

// // 添加这个 polyfill
// if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
//   window.Buffer = {
//     from: function(str) {
//       return str;
//     }
//   };
// }

const md = new MarkdownIt();

const post = reactive({
  title: "",
  date: "",
  category: "",
  rating: "",
  content: "",
});

const renderedContent = computed(() => md.render(post.content));
console.log(post.content);
console.log(renderedContent);

function createMarkdownFile() {
  const frontMatter = `---
title: "${post.title}"
date: "${post.date}"
category: "${post.category}"
rating: ${post.rating}
---
`;

  const markdownContent = frontMatter + post.content;

  // Here we'll add the logic to save the file
  console.log(markdownContent);
  // For now, we're just logging the content
  // In a real application, we'd use the File System Access API or a backend service
}
</script>

<style scoped>
.blog-post-editor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.editor-preview-container {
  display: flex;
  gap: 20px;
  margin-bottom: 1rem;
}

.editor,
.preview {
  flex: 1;
  min-height: 400px;
}

.preview {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  overflow-y: auto;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>