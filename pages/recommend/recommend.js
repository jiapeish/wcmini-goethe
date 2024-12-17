// pages/recommend/recommend.js
Page({
  data: {
    userInput: '',
    messages: [],
    scrollToView: ''
  },

  onLoad() {
    // Add initial AI greeting
    const initialMessages = [];
    initialMessages.push({
      type: 'ai',
      content: '你好！我是德语AI助手，请问有什么可以帮您？'
    });
    this.setData({
      messages: initialMessages
    });
  },

  handleInput(e) {
    this.setData({
      userInput: e.detail.value
    });
  },

  scrollToBottom() {
    const messages = this.data.messages;
    if (messages.length > 0) {
      this.setData({
        scrollToView: `msg-${messages.length - 1}`
      });
    }
  },

  sendMessage(e) {
    const content = this.data.userInput.trim();
    if (!content) {
      wx.showToast({
        title: '请输入您的问题',
        icon: 'none'
      });
      return;
    }

    // Add user message
    const messages = this.data.messages;
    messages.push({
      type: 'user',
      content: content
    });

    this.setData({
      messages: messages,
      userInput: ''
    }, () => {
      this.scrollToBottom();
    });

    // Send to API with default timeout (20s)
    wx.cloud.callContainer({
      config: {
        env: 'prod-3gq9kpp7b8085f19'
      },
      path: '/chat',
      header: {
        'X-WX-SERVICE': 'golang-il7e'
      },
      method: 'POST',
      data: {
        model: 'google/gemini-2.0-flash-exp:free',
        message: [content]
      }
    }).then(res => {
      console.log('Response:', res);
      if (res.statusCode === 200 && res.data.status === 'success') {
        if (!res.data.content || !res.data.content.trim()) {
          // 处理空响应
          const currentMessages = this.data.messages;
          currentMessages.push({
            type: 'ai',
            content: '我遇到了一些网络问题，请稍后再试'
          });
          this.setData({
            messages: currentMessages
          }, () => {
            this.scrollToBottom();
          });
        } else {
          // 正常响应
          const currentMessages = this.data.messages;
          currentMessages.push({
            type: 'ai',
            content: res.data.content
          });
          this.setData({
            messages: currentMessages
          }, () => {
            this.scrollToBottom();
          });
        }
      } else {
        throw new Error('API response not successful');
      }
    }).catch(err => {
      console.error('Error:', err);
      const currentMessages = this.data.messages;
      currentMessages.push({
        type: 'ai',
        content: '我遇到了一些网络问题，请稍后再试'
      });
      this.setData({
        messages: currentMessages
      }, () => {
        this.scrollToBottom();
      });
    });
  }
});
