Page({
  data: {
    sections: {
      vocabulary: [
        {
          title: 'B1.1词汇',
          subtitle: '查看更方便',
          icon: 'vocab',
          bgColor: 'yellow'
        },
        {
          title: '单词消消乐',
          subtitle: '闯关进步快',
          icon: 'snail',
          bgColor: 'blue'
        }
      ],
      reading: [
        {
          title: '课文评测',
          subtitle: '纠正语法',
          icon: 'reading',
          bgColor: 'purple',
          fullWidth: true
        }
      ]
    }
  },

  onLoad() {
    // Initialize any necessary data or state
  },

  // Handle card click events
  handleCardTap(e) {
    const { section, index } = e.currentTarget.dataset;
    const item = this.data.sections[section][index];
    
    // 处理单元词汇点击
    if (section === 'vocabulary' && index === 0) {
      wx.navigateTo({
        url: '/packages/vocabulary/pages/vocabulary/vocabulary'
      });
      return;
    }

    // 处理单词消消乐点击
    if (section === 'vocabulary' && index === 1) {
      wx.navigateTo({
        url: '/packages/vocabulary/pages/word-game/word-game'
      });
      return;
    }

    // 其他功能显示开发中
    wx.showToast({
      title: `${item.title}功能开发中`,
      icon: 'none',
      duration: 2000
    });
  }
});
