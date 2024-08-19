<template>
  <div class="tag-manager">
    <!-- 顯示所有標籤的區塊 -->
    <div class="all-tags">
      <h3>所有標籤</h3>
      <div class="tag-grid">
        <div v-for="tag in allTags" :key="tag.id" class="tag-item">
          <span>{{ tag.name }}</span>
          <span class="tag-category">({{ tag.category }})</span>
          <button @click="editTag(tag)">編輯</button>
          <button @click="deleteTag(tag.id)">刪除</button>
        </div>
      </div>
    </div>

    <!-- 原有的標籤層級結構 -->
    <div class="tag-hierarchy">
      <h3>標籤層級結構</h3>
      <div class="tag-list">
        <div v-for="tag in rootTags" :key="tag.id" class="tag-item">
          <span>{{ tag.name }}</span>
          <button @click="editTag(tag)">編輯</button>
          <button @click="deleteTag(tag.id)">刪除</button>
          <div v-if="getChildTags(tag.id).length > 0" class="child-tags">
            <div
              v-for="childTag in getChildTags(tag.id)"
              :key="childTag.id"
              class="tag-item"
            >
              <span>{{ childTag.name }}</span>
              <button @click="editTag(childTag)">編輯</button>
              <button @click="deleteTag(childTag.id)">刪除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <button @click="showAddTagForm = true">新增標籤</button>

    <!-- 新增/編輯標籤表單 -->
    <div v-if="showAddTagForm || editingTag" class="tag-form">
      <h3>{{ editingTag ? "編輯標籤" : "新增標籤" }}</h3>
      <input v-model="tagForm.name" placeholder="標籤名稱" />
      <input v-model="tagForm.description" placeholder="標籤描述" />
      <select v-model="tagForm.category">
        <option value="boardgame">桌遊</option>
        <option value="movie">電影</option>
        <!-- 添加更多類別 -->
      </select>
      <select v-model="tagForm.parentId">
        <option value="">無父標籤</option>
        <option v-for="tag in rootTags" :key="tag.id" :value="tag.id">
          {{ tag.name }}
        </option>
      </select>
      <button @click="saveTag">保存</button>
      <button @click="cancelEdit">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed ,onMounted} from "vue";
import { useTagStore } from "@/stores/tagStore";

const tagStore = useTagStore();

const showAddTagForm = ref(false);
const editingTag = ref(null);
const tagForm = ref({
  name: "",
  description: "",
  category: "boardgame",
  parentId: null,
});

const allTags = computed(()=>tagStore.tags);
const rootTags = computed(() => tagStore.getRootTags);
const getChildTags = (parentId) => tagStore.getChildTags(parentId);

onMounted(async () => {
  await tagStore.fetchTags();
});

function editTag(tag) {
  editingTag.value = tag;
  tagForm.value = { ...tag };
  showAddTagForm.value = true;
}

function deleteTag(id) {
  if (confirm("確定要刪除此標籤嗎？")) {
    tagStore.deleteTag(id);
  }
}

function saveTag() {
  if (editingTag.value) {
    tagStore.updateTag({ ...editingTag.value, ...tagForm.value });
  } else {
    tagStore.addTag({
      id: Date.now().toString(), // 簡單的 ID 生成方式，實際應用中可能需要更複雜的邏輯
      ...tagForm.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  cancelEdit();
}

function cancelEdit() {
  showAddTagForm.value = false;
  editingTag.value = null;
  tagForm.value = {
    name: "",
    description: "",
    category: "boardgame",
    parentId: null,
  };
}
</script>


<style scoped>
.tag-manager {
  max-width: 800px;
  margin: 0 auto;
}

.all-tags, .tag-hierarchy {
  margin-bottom: 30px;
}

.tag-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.tag-item {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
}

.tag-category {
  font-size: 0.8em;
  color: #666;
}

.child-tags {
  margin-left: 20px;
  margin-top: 10px;
}

.tag-form {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 20px;
}

button {
  margin-left: 5px;
  padding: 2px 5px;
  font-size: 0.8em;
}
</style>