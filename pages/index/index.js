Page({
  data: {
    userCount: 1748227,
    sections: {
      vocabulary: [
        {
          title: '单元词汇',
          subtitle: '查看更方便',
          icon: 'vocab',
          bgColor: 'yellow'
        },
        {
          title: '单词练习',
          subtitle: '闯关进步快',
          icon: 'snail',
          bgColor: 'blue'
        }
      ],
      reading: [
        {
          title: 'AI互动学英语场景互动',
          subtitle: '实时反馈 学得快',
          icon: 'ai-rabbit',
          bgColor: 'blue',
          fullWidth: true
        },
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
    wx.showToast({
      title: `${item.title}功能开发中`,
      icon: 'none',
      duration: 2000
    });
  }
});
