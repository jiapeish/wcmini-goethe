Page({
  data: {
    favoriteWords: [],
    loading: true
  },

  onLoad() {
    this.loadFavorites();
  },

  onShow() {
    // 每次页面显示时重新加载收藏
    this.loadFavorites();
  },

  loadFavorites() {
    try {
      const favorites = wx.getStorageSync('favoriteWords') || [];
      // 按时间戳倒序排列，最新收藏的显示在前面
      favorites.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      this.setData({
        favoriteWords: favorites,
        loading: false
      });
    } catch (error) {
      console.error('Failed to load favorites:', error);
      wx.showToast({
        title: '加载收藏失败',
        icon: 'none'
      });
    }
  },

  // 检查两个单词是否完全相同
  isSameWord(word1, word2) {
    // 基本属性比较
    if (word1.word !== word2.word || 
        word1.type !== word2.type || 
        word1.meaning !== word2.meaning) {
      return false;
    }

    // 根据类型比较特定属性
    switch (word1.type) {
      case 'noun':
        return word1.article === word2.article && 
               word1.plural === word2.plural;
      case 'verb':
      case 'reflexive_verb':
        return JSON.stringify(word1.forms) === JSON.stringify(word2.forms);
      default:
        return true;
    }
  },

  // 取消收藏
  handleUnfavorite(e) {
    const { index } = e.currentTarget.dataset;
    const { favoriteWords } = this.data;
    const wordToRemove = favoriteWords[index];
    
    // 从收藏列表中移除
    favoriteWords.splice(index, 1);
    
    // 更新存储和界面
    wx.setStorageSync('favoriteWords', favoriteWords);
    this.setData({ favoriteWords });
    
    wx.showToast({
      title: '已取消收藏',
      icon: 'success'
    });
  },

  // 点击单词跳转到对应的单词列表
  handleWordTap(e) {
    const { wordListId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/packages/vocabulary/pages/word-list/word-list?id=${wordListId}`
    });
  }
});
