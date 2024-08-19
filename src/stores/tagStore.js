// src/stores/tagStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useTagStore = defineStore('tag', {
  state: () => ({
    tags: [],
    loading: false,
    error: null
  }),
  getters: {
    getTagById: (state) => (id) => state.tags.find(tag => tag.id === id),
    getTagsByCategory: (state) => (category) => state.tags.filter(tag => tag.category === category),
    getRootTags: (state) => state.tags.filter(tag => tag.parentId === null),
    getChildTags: (state) => (parentId) => state.tags.filter(tag => tag.parentId === parentId)
  },
  actions: {

    //獲取所有標籤 
    async fetchTags() {
      this.loading = true
      try {
        const response = await axios.get('/api/tags')
        this.tags = response.data.data
        console.log('Fetched tags:', this.tags); // 添加日誌
        this.error = null
      } catch (error) {
        console.error('Error fetching tags 錯誤錯誤:', error)
        this.error = "failed to fetch tags"
      } finally {
        this.loading = false
      }
    },

    //新增
    async addTag(tag) {
      try {
        const response = await axios.post('/api/tags', tag)
        this.tags.push(response.data.data);
        return response.data.data
      } catch (error) {
        console.error('Error adding tag新增標籤錯誤:', error)
        throw error
      }
    },
    
    // 更新現有標籤
    async updateTag(tag) {
      try {
        const response = await axios.put(`/api/tags/${tag.id}`, tag)
        const index = this.tags.findIndex(t => t.id === tag.id)
        if (index !== -1) {
          this.tags[index] = response.data.data
        }
        return response.data.data
      } catch (error) {
        console.error('Error updating tag:', error)
        throw error
      }
    },

    // 刪除標籤
    async deleteTag(id) {
      try {
        await axios.delete(`/api/tags/${id}`)
        this.tags = this.tags.filter(tag => tag.id !== id)
      } catch (error) {
        console.error('Error deleting tag:', error)
        throw error
      }
    },
  //   loadTags(tags) {
  //     this.tags = tags;
  //   }
  }
});