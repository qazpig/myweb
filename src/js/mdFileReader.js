import matter from 'gray-matter';

/**
 * 加載並解析 Markdown 文件
 * @param {File} file - 用戶選擇的 Markdown 文件
 * @returns {Promise<Object>} 解析後的文章數據
 */
export function loadMdFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target.result;
        // 使用 gray-matter 解析 frontmatter 和 Markdown 內容
        const { data, content: markdownContent } = matter(content);

        // 解析標籤
        let tags = [];
        if (data.tags && Array.isArray(data.tags)) {
          tags = data.tags;
        } else if (typeof data.tags === 'string') {
          // 處理可能的字符串形式的標籤
          tags = data.tags.split(',').map(tag => tag.trim());
        }

        // 返回解析後的數據
        resolve({
          title: data.title || '',
          date: data.date || '',
          category: data.category || '',
          rating: data.rating || '',
          tags: tags,
          content: markdownContent
        });
      } catch (error) {
        reject(new Error('解析 Markdown 文件失敗'));
      }
    };

    reader.onerror = () => reject(new Error('讀取文件失敗'));

    // 開始讀取文件
    reader.readAsText(file);
  });
}