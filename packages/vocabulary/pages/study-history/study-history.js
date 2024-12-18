Page({
  data: {
    historyList: [],
    loading: true
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    // 每次页面显示时重新加载历史记录
    this.loadHistory();
  },

  loadHistory() {
    try {
      const history = wx.getStorageSync('studyHistory') || [];
      this.setData({
        historyList: history.reverse(), // 最新的记录显示在前面
        loading: false
      });
    } catch (error) {
      console.error('Failed to load study history:', error);
      wx.showToast({
        title: '加载历史记录失败',
        icon: 'none'
      });
    }
  },

  // 点击历史记录项，跳转到对应的单词列表
  handleHistoryTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/word-list/word-list?id=${id}`
    });
  }
});
