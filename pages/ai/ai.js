Page({
  data: {
    messages: [],
    inputValue: '',
    botId: 'bot-011af47b'
  },

  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  async sendMessage() {
    if (!this.data.inputValue.trim()) return;

    const userMessage = this.data.inputValue.trim();
    const messages = [...this.data.messages, {
      role: 'user',
      content: userMessage
    }];

    this.setData({
      messages,
      inputValue: ''
    });

    try {
      const app = getApp();
      const ai = await app.ai();
      const res = await ai.bot.sendMessage({
        botId: this.data.botId,
        msg: userMessage,
        history: this.data.messages
      });

      let response = '';
      for await (let str of res.dataStream) {
        response += str.content;
        this.setData({
          messages: [...messages, {
            role: 'assistant',
            content: response
          }]
        });
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      wx.showToast({
        title: '发送失败',
        icon: 'error'
      });
    }
  }
});
