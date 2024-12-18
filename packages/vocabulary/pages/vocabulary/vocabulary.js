Page({
  data: {
    currentCardIndex: 0,
    wordUnits: [],
    loading: true
  },

  onLoad() {
    this.loadWordUnits();
  },

  onShow() {
    // 每次显示页面时更新进度
    if (this.data.wordUnits.length > 0) {
      this.updateProgress();
    }
  },

  // 获取要显示的单词文本
  getWordText(word) {
    if (word.type === 'verb') {
      return word.forms.infinitive;
    }
    return word.word;
  },

  // 更新学习进度
  updateProgress() {
    const history = wx.getStorageSync('studyHistory') || [];
    const wordUnits = this.data.wordUnits.map(unit => {
      const lists = unit.lists.map(list => {
        const record = history.find(h => h.wordListId === list.id);
        return {
          ...list,
          progress: record ? record.progress : 0
        };
      });
      return {
        ...unit,
        lists
      };
    });

    this.setData({ wordUnits });
  },

  loadWordUnits() {
    try {
      const units = [];
      const fs = wx.getFileSystemManager();
      
      // 加载Einheit01的数据
      const unit01 = {
        title: 'Einheit01',
        lists: []
      };
      
      // 加载Einheit01的8组单词
      for (let i = 1; i <= 8; i++) {
        const fileNum = i.toString().padStart(2, '0');
        const filePath = `data/vocabulary/B1-1/Einheit01/B1.1.1-Einheit01-${fileNum}.json`;
        
        try {
          const res = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(res);
          unit01.lists.push({
            id: i,
            title: `第${i}组单词`,
            total: data.data.total,
            words: data.data.words.map(word => ({
              ...word,
              displayText: this.getWordText(word)
            })),
            progress: 0,  // 初始进度为0
            bgColor: this.getBackgroundColor(i)
          });
        } catch (err) {
          console.error(`Failed to load file ${filePath}:`, err);
          wx.showToast({
            title: `加载第${i}组单词失败`,
            icon: 'none'
          });
        }
      }

      if (unit01.lists.length > 0) {
        units.push(unit01);
      }

      // 加载Einheit02的数据
      const unit02 = {
        title: 'Einheit02',
        lists: []
      };
      
      // 加载Einheit02的8组单词
      for (let i = 1; i <= 8; i++) {
        const fileNum = i.toString().padStart(2, '0');
        const filePath = `data/vocabulary/B1-1/Einheit02/B1.1.1-Einheit02-${fileNum}.json`;
        
        try {
          const res = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(res);
          unit02.lists.push({
            id: i + 8, // Einheit02的ID从9开始，避免与Einheit01冲突
            title: `第${i}组单词`,
            total: data.data.total,
            words: data.data.words.map(word => ({
              ...word,
              displayText: this.getWordText(word)
            })),
            progress: 0,  // 初始进度为0
            bgColor: this.getBackgroundColor(i)
          });
        } catch (err) {
          console.error(`Failed to load file ${filePath}:`, err);
          wx.showToast({
            title: `加载第${i}组单词失败`,
            icon: 'none'
          });
        }
      }

      if (unit02.lists.length > 0) {
        units.push(unit02);
      }

      if (units.length > 0) {
        this.setData({
          wordUnits: units,
          loading: false
        }, () => {
          // 加载完数据后更新进度
          this.updateProgress();
        });
      } else {
        throw new Error('No word lists loaded');
      }
    } catch (error) {
      console.error('Load word lists failed:', error);
      wx.showToast({
        title: '加载单词列表失败',
        icon: 'none'
      });
    }
  },

  getBackgroundColor(index) {
    const colors = [
      "linear-gradient(135deg, #FFE4B5, #FFA07A)",
      "linear-gradient(135deg, #E0FFFF, #87CEEB)",
      "linear-gradient(135deg, #DDA0DD, #BA55D3)",
      "linear-gradient(135deg, #98FB98, #3CB371)",
      "linear-gradient(135deg, #FFC0CB, #FF69B4)",
      "linear-gradient(135deg, #F0E68C, #DAA520)",
      "linear-gradient(135deg, #B0E0E6, #4682B4)",
      "linear-gradient(135deg, #D3D3D3, #A9A9A9)"
    ];
    return colors[(index - 1) % colors.length];
  },

  handleCardTap(e) {
    const { unitIndex, listIndex } = e.currentTarget.dataset;
    const wordList = this.data.wordUnits[unitIndex].lists[listIndex];
    wx.navigateTo({
      url: `/packages/vocabulary/pages/word-list/word-list?id=${wordList.id}`
    });
  }
});
