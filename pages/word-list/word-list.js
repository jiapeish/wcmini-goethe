Page({
  data: {
    wordList: [],
    loading: true,
    currentIndex: 0,
    showMeaning: false,
    studyProgress: 0,
    isFavorite: false,
    styleSettings: {
      fontFamily: 'default',
      fontSize: 'medium',
      wordColor: '#333333'
    },
    computedStyles: {
      fontFamily: 'unset',
      fontSize: '48rpx'
    }
  },

  onLoad(options) {
    const { id } = options;
    this.wordListId = id;
    this.loadWordList(id);
    this.loadStyleSettings();
  },

  computeStyles(settings) {
    const fontSize = settings.fontSize === 'small' ? '40' : 
                    settings.fontSize === 'medium' ? '48' : '56';
    const fontFamily = settings.fontFamily === 'default' ? 'unset' : settings.fontFamily;

    this.setData({
      computedStyles: {
        fontFamily,
        fontSize: fontSize + 'rpx'
      }
    });
  },

  loadStyleSettings() {
    try {
      const settings = wx.getStorageSync('wordCardSettings');
      if (settings) {
        this.setData({
          styleSettings: settings
        });
        this.computeStyles(settings);
      }
    } catch (error) {
      console.error('Failed to load style settings:', error);
    }
  },

  loadWordList(id) {
    try {
      const fileNum = id.toString().padStart(2, '0');
      const filePath = `/data/vocabulary/B1-1/Einheit02/B1.1.1-Einheit02-${fileNum}.json`;
      const fs = wx.getFileSystemManager();
      
      try {
        const res = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(res);
        this.setData({
          wordList: data.data.words,
          loading: false
        }, () => {
          // 在数据加载完成后再初始化进度
          this.initProgress();
          this.checkFavoriteStatus();
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

  // 初始化进度
  initProgress() {
    try {
      const history = wx.getStorageSync('studyHistory') || [];
      const record = history.find(item => item.wordListId === parseInt(this.wordListId));
      if (record) {
        this.setData({
          currentIndex: record.lastIndex || 0,
          studyProgress: record.progress || 0
        });
      }
    } catch (error) {
      console.error('Failed to init progress:', error);
    }
  },

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

  toggleFavorite() {
    try {
      const currentWord = this.data.wordList[this.data.currentIndex];
      let favorites = wx.getStorageSync('favoriteWords') || [];
      const wordIndex = favorites.findIndex(word => 
        word.word === currentWord.word && 
        word.wordListId === parseInt(this.wordListId)
      );

      if (wordIndex === -1) {
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

  toggleMeaning() {
    this.setData({
      showMeaning: !this.data.showMeaning
    });
    this.updateProgress();
  },

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

  updateProgress() {
    // 计算进度：当前查看的单词数占总单词数的百分比
    const progress = Math.round(((this.data.currentIndex + 1) / this.data.wordList.length) * 100);
    
    this.setData({ studyProgress: progress });
    
    // 更新学习历史
    try {
      let history = wx.getStorageSync('studyHistory') || [];
      const newRecord = {
        wordListId: parseInt(this.wordListId),
        totalWords: this.data.wordList.length,
        progress: progress,
        timestamp: new Date().toLocaleString(),
        lastIndex: this.data.currentIndex
      };

      const existingIndex = history.findIndex(item => item.wordListId === parseInt(this.wordListId));
      
      if (existingIndex !== -1) {
        // 如果新进度大于旧进度，才更新
        if (progress > history[existingIndex].progress) {
          history[existingIndex] = newRecord;
        }
      } else {
        history.push(newRecord);
      }

      // 限制历史记录数量
      if (history.length > 20) {
        history = history.slice(-20);
      }

      wx.setStorageSync('studyHistory', history);
    } catch (error) {
      console.error('Failed to update study history:', error);
    }
  },

  goBack() {
    wx.navigateBack();
  }
});
