const r=`---\r
title: 測試桌遊標題噗噗\r
rating: 5\r
date: "2023-05-15"\r
category: BoardGame\r
---\r
\r
\r
\r
$\\frac{2}{3}$\r
\`\`\`javascript=\r
const routes = [\r
  {\r
    path: '/:category',  \r
    name: 'Category',  \r
    component: CategoryView,\r
    props: true\r
  },\r
  {\r
    path: '/:category/:id',\r
    name: 'Article',\r
    component: CategoryView,\r
    props: route => ({ \r
      category: route.params.category, \r
      articleId: route.params.id \r
    })\r
  }\r
]\r
\`\`\`\r
== props ==\r
\r
==dsfsdf==\r
\r
'sdf'\r
\r
''asfasf''\r
\`jkjh\`kjh\r
\`\`jkhkjh\`\`kj\r
\r
-sdf-\r
--sdfsdf--\r
~~dsfkj~~\r
*sds\r
*sd\r
*s\r
*sd*sd*sd**\r
\r
*sd\r
*sd*\r
\r
\r
\r
\r
\r
\r
\r
## 文章測試\r
\r
asdjnoa danasd od ud ennrrrn  qwi  i en.ne i e\r
`;export{r as default};
