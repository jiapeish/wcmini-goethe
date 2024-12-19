Page({
  data: {
    currentUnit: 'Einheit01',
    currentWordIndex: 0,
    totalWords: 0,
    matchedPairs: 0,
    totalPairs: 0,
    tiles: [],
    selectedTile: null,
    words: []
  },

  onLoad() {
    this.loadWords();
  },

  // 获取单词显示文本
  getWordText(word) {
    switch (word.type) {
      case 'verb':
      case 'reflexive_verb':
        return word.forms.infinitive;
      case 'noun':
        return `${word.article} ${word.word}`;
      case 'adjective':
        return word.word;
      default:
        return word.word;
    }
  },

  // 加载单词数据
  loadWords() {
    try {
      const fs = wx.getFileSystemManager();
      const currentUnit = this.data.currentUnit;
      const words = [];

      // 加载当前Einheit的8组单词
      for (let i = 1; i <= 8; i++) {
        const fileNum = i.toString().padStart(2, '0');
        const filePath = `data/vocabulary/B1-1/${currentUnit}/B1.1.1-${currentUnit}-${fileNum}.json`;
        
        try {
          const res = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(res);
          words.push(...data.data.words);
        } catch (err) {
          console.error(`Failed to load file ${filePath}:`, err);
        }
      }

      this.setData({ 
        words,
        totalWords: words.length
      }, () => {
        this.setupGame();
      });
    } catch (error) {
      console.error('Load words failed:', error);
      wx.showToast({
        title: '加载单词失败',
        icon: 'none'
      });
    }
  },

  // 设置游戏
  setupGame() {
    const { words, currentWordIndex } = this.data;
    const gameWords = words.slice(currentWordIndex, currentWordIndex + 8); // 每页显示8个单词对
    const tiles = [];
    
    // 创建德语和中文配对卡片
    gameWords.forEach((word, index) => {
      // 德语卡片
      tiles.push({
        id: index * 2,
        text: this.getWordText(word),
        type: 'de',
        pairId: index,
        selected: false,
        matched: false
      });
      // 中文卡片
      tiles.push({
        id: index * 2 + 1,
        text: word.meaning,
        type: 'zh',
        pairId: index,
        selected: false,
        matched: false
      });
    });

    // 随机打乱卡片顺序
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    this.setData({
      tiles,
      totalPairs: gameWords.length,
      matchedPairs: 0,
      selectedTile: null
    });
  },

  // 处理卡片点击
  handleTileTap(e) {
    const index = e.currentTarget.dataset.index;
    const tiles = [...this.data.tiles];
    const tile = tiles[index];

    // 如果卡片已匹配或已选中，则忽略
    if (tile.matched || tile.selected) return;

    const selectedTile = this.data.selectedTile;
    tile.selected = true;

    if (!selectedTile) {
      // 第一次选择
      this.setData({
        tiles,
        selectedTile: tile
      });
    } else {
      // 第二次选择，检查是否匹配
      if (selectedTile.pairId === tile.pairId && selectedTile.type !== tile.type) {
        // 匹配成功
        tile.matched = true;
        tiles[tiles.findIndex(t => t.id === selectedTile.id)].matched = true;
        
        this.setData({
          tiles,
          selectedTile: null,
          matchedPairs: this.data.matchedPairs + 1
        });

        // 检查是否完成当前页面
        if (this.data.matchedPairs === this.data.totalPairs) {
          wx.showToast({
            title: '太棒了！',
            icon: 'success'
          });
        }
      } else {
        // 匹配失败，短暂显示后翻转回去
        setTimeout(() => {
          tiles[tiles.findIndex(t => t.id === selectedTile.id)].selected = false;
          tile.selected = false;
          this.setData({
            tiles,
            selectedTile: null
          });
        }, 1000);
      }
    }
  },

  // 处理上一关
  handlePrevLevel() {
    if (this.data.currentWordIndex >= 8) {
      this.setData({
        currentWordIndex: this.data.currentWordIndex - 8
      }, () => {
        this.setupGame();
      });
    }
  },

  // 处理下一关
  handleNextLevel() {
    const { currentWordIndex, totalWords, currentUnit } = this.data;
    
    if (currentWordIndex + 8 < totalWords) {
      // 还有更多单词，继续当前Einheit
      this.setData({
        currentWordIndex: currentWordIndex + 8
      }, () => {
        this.setupGame();
      });
    } else if (currentUnit === 'Einheit01') {
      // 完成Einheit01，进入Einheit02
      this.setData({
        currentUnit: 'Einheit02',
        currentWordIndex: 0
      }, () => {
        this.loadWords();
      });
    } else {
      // 完成所有单词，返回首页
      wx.showModal({
        title: '恭喜',
        content: '你已完成所有单词练习！',
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      });
    }
  }
});
