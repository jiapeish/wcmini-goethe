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

  // 取消收藏
  handleUnfavorite(e) {
    const { index } = e.currentTarget.dataset;
    const { favoriteWords } = this.data;
    
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
      url: `/pages/word-list/word-list?id=${wordListId}`
    });
  }
});
