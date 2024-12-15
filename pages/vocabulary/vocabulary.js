Page({
  data: {
    currentCardIndex: 0,
    wordLists: [],
    loading: true
  },

  onLoad() {
    this.loadWordLists();
  },

  loadWordLists() {
    try {
      const lists = [];
      const fs = wx.getFileSystemManager();
      
      for (let i = 1; i <= 8; i++) {
        const fileNum = i.toString().padStart(2, '0');
        const filePath = `/data/vocabulary/B1.1.1-Einheit02-${fileNum}.json`;
        
        try {
          const res = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(res);
          lists.push({
            id: i,
            title: `第${i}组单词`,
            total: data.data.total,
            words: data.data.words,
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

      if (lists.length > 0) {
        this.setData({
          wordLists: lists,
          loading: false
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
    return colors[index - 1] || colors[0];
  },

  handleCardTap(e) {
    const { index } = e.currentTarget.dataset;
    const wordList = this.data.wordLists[index];
    wx.navigateTo({
      url: `/pages/word-list/word-list?id=${wordList.id}`
    });
  }
});
