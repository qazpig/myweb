// import { MockMethod } from "vite-plugin-mock";
// import { tagsList } from "@/data/tagsList";

const tags = [
  // ...tagsList]
  { id: '1', name: '策略', parentId: null, category: 'boardgame', description: '' },
  { id: '2', name: '家庭', parentId: null, category: 'boardgame', description: '' },
  { id: '3', name: '派對', parentId: null, category: 'boardgame', description: '' },
  { id: '4', name: '輕策略', parentId: '1', category: 'boardgame', description: '' },
  { id: '5', name: '重策略', parentId: '1', category: 'boardgame', description: '' },
  { id: '6', name: '兒童', parentId: '2', category: 'boardgame', description: '' },
  { id: '7', name: '聚會', parentId: '3', category: 'boardgame', description: '' },
  { id: '8', name: '科幻', parentId: null, category: 'movie', description: '' },
  { id: '9', name: '動作', parentId: null, category: 'movie', description: '' },
  { id: '10', name: '劇情', parentId: null, category: 'movie', description: '' },
  { id: '11', name: '太空歌劇', parentId: '8', category: 'movie', description: '' },
  { id: '12', name: '賽博朋克', parentId: '8', category: 'movie', description: '' },
  { id: '13', name: '武俠', parentId: '9', category: 'movie', description: '' },
  { id: '14', name: '冒險', parentId: '9', category: 'movie', description: '' },
  { id: '15', name: '動畫', parentId: null, category: 'anime', description: '' },
  { id: '16', name: '少年', parentId: '15', category: 'anime', description: '' },
  { id: '17', name: '少女', parentId: '15', category: 'anime', description: '' },
  { id: '18', name: '成人', parentId: '15', category: 'anime', description: '' },
  { id: '19', name: '解謎', parentId: null, category: 'escapegame', description: '' },
  { id: '20', name: '恐怖', parentId: null, category: 'escapegame', description: '' },
  { id: '21', name: '雜項', parentId: null, category: 'various', description: '' },
  { id: '22', name: '推理', parentId: null, category: 'various', description: '' },
  { id: '23', name: '動機', parentId: null, category: 'education', description: '' },
  { id: '24', name: '教法', parentId: null, category: 'education', description: '' },
]

export default [
  //獲取所有標籤
  {
    url: '/api/tags',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: tags
      }
    }
  },
  //添加新標籤
  {
    url: 'api/tags',
    method: 'post',
    response: ({body})=>{
      const newTag = {...body, id: String(tags.length+1)}
      tags.push(newTag)
      return{
        code: 200,
        data: newTag
      }
    }
  },
  //添加標籤 //更新標籤
  {
    url: '/api/tags/:id',
    method: 'put',
    response: ({ body }) => {
      const index = tags.findIndex(tag => tag.id === body.id)
      if (index>-1) {
        tags[index] = {...tags[index],...body}
        return{
          code: 200,
          data: tags[index]
        }
      }
      return {
        code: 404,
        message: 'Tag not found'
      }
    }
  },
  // 刪除標籤
  {
    url: '/api/tags/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = tags.findIndex(tag => tag.id === query.id)
      if (index > -1) {
        tags.splice(index, 1)
        return {
          code: 200,
          message: 'Tag deleted successfully'
        }
      }
      return {
        code: 404,
        message: 'Tag not found'
      }
    }
  }
] 