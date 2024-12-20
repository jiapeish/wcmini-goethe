Page({
  data: {
    wordList: [],
    loading: true,
    currentIndex: 0,
    showMeaning: false,
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
    const { id, word } = options;
    this.wordListId = id;
    this.targetWord = word ? JSON.parse(decodeURIComponent(word)) : null;
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
      // 确定是哪个单元的单词列表
      const einheitNum = parseInt(id) <= 8 ? '01' : '02';
      // 如果是Einheit02，需要将ID减8来获取正确的文件编号
      const fileNum = (parseInt(id) <= 8 ? id : (id - 8)).toString().padStart(2, '0');
      const filePath = `/data/vocabulary/B1-1/Einheit${einheitNum}/B1.1.1-Einheit${einheitNum}-${fileNum}.json`;
      const fs = wx.getFileSystemManager();
      
      try {
        const res = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(res);
        this.setData({
          wordList: data.data.words,
          loading: false
        }, () => {
          // 如果有目标单词，找到并显示它
          if (this.targetWord) {
            const index = this.findWordIndex(this.targetWord);
            if (index !== -1) {
              this.setData({ currentIndex: index });
            }
          }
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

  // 查找特定单词在列表中的索引
  findWordIndex(targetWord) {
    return this.data.wordList.findIndex(word => this.isSameWord(word, targetWord));
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

  checkFavoriteStatus() {
    try {
      const favorites = wx.getStorageSync('favoriteWords') || [];
      const currentWord = this.data.wordList[this.data.currentIndex];
      const isFavorite = favorites.some(word => 
        this.isSameWord(word, currentWord) && 
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
        this.isSameWord(word, currentWord) && 
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
  },

  prevWord() {
    if (this.data.currentIndex > 0) {
      this.setData({
        currentIndex: this.data.currentIndex - 1,
        showMeaning: false
      });
      this.checkFavoriteStatus();
    }
  },

  nextWord() {
    if (this.data.currentIndex < this.data.wordList.length - 1) {
      this.setData({
        currentIndex: this.data.currentIndex + 1,
        showMeaning: false
      });
      this.checkFavoriteStatus();
    }
  },

  goBack() {
    wx.navigateBack();
  }
});
