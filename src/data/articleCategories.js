export const articleCategories = [
  {
    id: 'boardgame', name: '桌遊', view: 'BoardGamesView',
    theme: {
      primaryColor: '#3498db',
      backgroundColor: '#ecf0f1',
      headerColor: '#2980b9'
    }
  },
  {
    id: 'movies', name: '電影', 
    theme: {
      primaryColor: '#3498db',
      backgroundColor: '#ecf0f1',
      headerColor: '#2980b9'
    }
  },
  {
    id: 'anime', name: '動畫',
    theme: {
      primaryColor: '#e74c3c',
      backgroundColor: '#fce5e5',
      headerColor: '#c0392b'
    }
  },
  {
    id: 'escapegames', name: '實境遊戲',
    theme: {
      primaryColor: '#f39c12',
      backgroundColor: '#fef5e7',
      headerColor: '#d35400'
    }
  },
  {
    id: 'edu', name: '教育', 
    // view: 'EducationView',
    theme: {
      primaryColor: '#3498db',
      backgroundColor: '#ecf0f1',
      headerColor: '#2980b9'
    }
  }
  // 未來可以在這裡輕鬆添加新的類型
];

export const getArticleCategoryById = (id) => articleCategories.find(type => type.id === id);