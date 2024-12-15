Page({
  data: {
    wordList: [],
    loading: true,
    currentIndex: 0,
    showMeaning: false
  },

  onLoad(options) {
    const { id } = options;
    this.loadWordList(id);
  },

  loadWordList(id) {
    try {
      const fileNum = id.toString().padStart(2, '0');
      const filePath = `/data/vocabulary/B1.1.1-Einheit02-${fileNum}.json`;
      const fs = wx.getFileSystemManager();
      
      try {
        const res = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(res);
        this.setData({
          wordList: data.data.words,
          loading: false
        });
      } catch (err) {
        console.error(`Failed to load file ${filePath}:`, err);
        wx.showToast({
          title: '加载单词列表失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('Load word list failed:', error);
      wx.showToast({
        title: '加载单词列表失败',
        icon: 'none'
      });
    }
  },

  // 切换显示中文含义
  toggleMeaning() {
    this.setData({
      showMeaning: !this.data.showMeaning
    });
  },

  // 上一个单词
  prevWord() {
    if (this.data.currentIndex > 0) {
      this.setData({
        currentIndex: this.data.currentIndex - 1,
        showMeaning: false
      });
    }
  },

  // 下一个单词
  nextWord() {
    if (this.data.currentIndex < this.data.wordList.length - 1) {
      this.setData({
        currentIndex: this.data.currentIndex + 1,
        showMeaning: false
      });
    }
  },

  // 返回单词列表页面
  goBack() {
    wx.navigateBack();
  }
});
