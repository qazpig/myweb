export const articleCategories = [
  { id: 'boardgame', name: '桌遊' ,view: 'BoardGamesView' },
  { id: 'movie', name: '電影' ,view: 'MoviesView'},
  { id: 'anime', name: '動畫' },
  { id: 'escapegame', name: '實境遊戲' },
  { id: 'edu', name: '教育' ,view: 'EducationView'}
  // 未來可以在這裡輕鬆添加新的類型
];

export const getArticleCategoryById = (id) => articleCategories.find(type => type.id === id);