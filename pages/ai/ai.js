Page({
  data: {
    messages: [],
    inputValue: '',
    botId: 'bot-011af47b',
    loading: false,
    initialized: false
  },

  async onLoad() {
    try {
      const ai = await getApp().ai();
      this.setData({ initialized: true });
    } catch (error) {
      console.error('AI初始化失败:', error);
      wx.showToast({
        title: '初始化失败，请重试',
        icon: 'error'
      });
    }
  },

  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  handleSuggestion(e) {
    const text = e.currentTarget.dataset.text;
    this.setData({
      inputValue: text
    }, () => {
      this.sendMessage();
    });
  },

  copyMessage(e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  clearMessages() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: [],
            inputValue: ''
          }, () => {
            wx.showToast({
              title: '已清空聊天记录',
              icon: 'success',
              duration: 1500
            });
          });
        }
      }
    });
  },

  cleanMarkdown(text) {
    return text
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .trim();
  },

  async sendMessage() {
    if (!this.data.inputValue.trim() || this.data.loading) return;

    if (!this.data.initialized) {
      wx.showToast({
        title: '系统初始化中',
        icon: 'loading'
      });
      return;
    }

    const userMessage = this.data.inputValue.trim();
    const messages = [...this.data.messages, {
      role: 'user',
      content: userMessage
    }, {
      role: 'assistant',
      content: '请稍等，正在卖力思考中🤔...'
    }];

    this.setData({
      messages,
      inputValue: '',
      loading: true
    });

    try {
      const ai = await getApp().ai();
      if (!ai) throw new Error('AI实例未初始化');

      const res = await ai.bot.sendMessage({
        botId: this.data.botId,
        msg: userMessage,
        history: this.data.messages.slice(0, -1) // 不包含加载消息
      });

      let response = '';
      for await (let str of res.dataStream) {
        response += str.content;
        const cleanedResponse = this.cleanMarkdown(response);
        // 更新最后一条消息（替换加载消息）
        const updatedMessages = [...this.data.messages];
        updatedMessages[updatedMessages.length - 1] = {
          role: 'assistant',
          content: cleanedResponse
        };
        this.setData({
          messages: updatedMessages
        });
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      wx.showToast({
        title: '发送失败',
        icon: 'error'
      });
      // 移除加载消息和失败的消息
      this.setData({
        messages: this.data.messages.slice(0, -2)
      });
    } finally {
      this.setData({
        loading: false
      });
    }
  }
});
