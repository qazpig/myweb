// import { MockMethod } from "vite-plugin-mock";


const tags = [
  { id: '1', name: '策略', parentId: null, category: 'boardgame' },
  { id: '2', name: '家庭', parentId: null, category: 'boardgame' },
  { id: '3', name: '派對', parentId: null, category: 'boardgame' },
  { id: '4', name: '科幻', parentId: null, category: 'movie' },
  { id: '5', name: '動作', parentId: null, category: 'movie' },
  // 添加更多初始標籤...
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