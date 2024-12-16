Page({
  data: {
    wordList: [],
    loading: true,
    currentIndex: 0,
    showMeaning: false,
    studyProgress: 0,
    isFavorite: false  // 当前单词的收藏状态
  },

  onLoad(options) {
    const { id } = options;
    this.wordListId = id; // 保存单词列表ID
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
        this.updateStudyHistory();
        this.checkFavoriteStatus();
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

  // 检查当前单词的收藏状态
  checkFavoriteStatus() {
    try {
      const favorites = wx.getStorageSync('favoriteWords') || [];
      const currentWord = this.data.wordList[this.data.currentIndex];
      const isFavorite = favorites.some(word => 
        word.word === currentWord.word && 
        word.wordListId === parseInt(this.wordListId)
      );
      this.setData({ isFavorite });
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  },

  // 切换收藏状态
  toggleFavorite() {
    try {
      const currentWord = this.data.wordList[this.data.currentIndex];
      let favorites = wx.getStorageSync('favoriteWords') || [];
      const wordIndex = favorites.findIndex(word => 
        word.word === currentWord.word && 
        word.wordListId === parseInt(this.wordListId)
      );

      if (wordIndex === -1) {
        // 添加到收藏
        favorites.push({
          ...currentWord,
          wordListId: parseInt(this.wordListId),
          timestamp: new Date().toLocaleString()
        });
        wx.showToast({
          title: '已收藏',
          icon: 'success'
        });
      } else {
        // 取消收藏
        favorites.splice(wordIndex, 1);
        wx.showToast({
          title: '已取消收藏',
          icon: 'success'
        });
      }

      wx.setStorageSync('favoriteWords', favorites);
      this.setData({ isFavorite: !this.data.isFavorite });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  // 切换显示中文含义
  toggleMeaning() {
    this.setData({
      showMeaning: !this.data.showMeaning
    });
    this.updateProgress();
  },

  // 上一个单词
  prevWord() {
    if (this.data.currentIndex > 0) {
      this.setData({
        currentIndex: this.data.currentIndex - 1,
        showMeaning: false
      });
      this.updateProgress();
      this.checkFavoriteStatus();
    }
  },

  // 下一个单词
  nextWord() {
    if (this.data.currentIndex < this.data.wordList.length - 1) {
      this.setData({
        currentIndex: this.data.currentIndex + 1,
        showMeaning: false
      });
      this.updateProgress();
      this.checkFavoriteStatus();
    }
  },

  // 更新学习进度
  updateProgress() {
    const progress = Math.round((this.data.currentIndex + 1) / this.data.wordList.length * 100);
    this.setData({ studyProgress: progress });
    this.updateStudyHistory();
  },

  // 更新学习历史
  updateStudyHistory() {
    try {
      let history = wx.getStorageSync('studyHistory') || [];
      
      const newRecord = {
        wordListId: this.wordListId,
        totalWords: this.data.wordList.length,
        progress: this.data.studyProgress,
        timestamp: new Date().toLocaleString(),
        lastIndex: this.data.currentIndex
      };

      const existingIndex = history.findIndex(item => item.wordListId === this.wordListId);
      
      if (existingIndex !== -1) {
        history[existingIndex] = newRecord;
      } else {
        history.push(newRecord);
      }

      if (history.length > 20) {
        history = history.slice(-20);
      }

      wx.setStorageSync('studyHistory', history);
    } catch (error) {
      console.error('Failed to update study history:', error);
    }
  },

  // 返回单词列表页面
  goBack() {
    wx.navigateBack();
  }
});
