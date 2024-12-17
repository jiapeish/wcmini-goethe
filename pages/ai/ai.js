import cloudbase from "@cloudbase/js-sdk/app";
import { registerAuth } from "@cloudbase/js-sdk/auth";
import { registerAi } from "@cloudbase/js-sdk/ai";

registerAuth(cloudbase);
registerAi(cloudbase);

Page({
  data: {
    messages: [],
    inputValue: '',
    loading: false,
    botId: 'bot-011af47b',
    env: 'wcmini-goethe-5gkgoxil4bab77bf'
  },

  async onLoad() {
    try {
      const app = cloudbase.init({
        env: this.data.env
      });
      
      const auth = app.auth({ persistence: "local" });
      await auth.signInWithOpenId();
      this.ai = await app.ai();
      
      // Get bot info
      const botInfo = await this.ai.bot.get({ botId: this.data.botId });
      if (botInfo.welcomeMessage) {
        this.setData({
          messages: [{
            role: 'assistant',
            content: botInfo.welcomeMessage
          }]
        });
      }
    } catch (error) {
      console.error('初始化失败:', error);
      wx.showToast({
        title: '初始化失败',
        icon: 'error'
      });
    }
  },

  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  async sendMessage() {
    if (!this.data.inputValue.trim() || this.data.loading) return;

    const userMessage = this.data.inputValue.trim();
    this.setData({
      messages: [...this.data.messages, {
        role: 'user',
        content: userMessage
      }],
      inputValue: '',
      loading: true
    });

    try {
      const res = await this.ai.bot.sendMessage({
        botId: this.data.botId,
        msg: userMessage,
      });

      let fullResponse = '';
      for await (let str of res.textStream) {
        fullResponse += str;
        // Update the last message (bot's response) in real-time
        const messages = [...this.data.messages];
        if (messages[messages.length - 1].role === 'assistant') {
          messages[messages.length - 1].content = fullResponse;
        } else {
          messages.push({
            role: 'assistant',
            content: fullResponse
          });
        }
        this.setData({ messages });
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      wx.showToast({
        title: '发送失败',
        icon: 'error'
      });
    } finally {
      this.setData({ loading: false });
    }
  }
});
