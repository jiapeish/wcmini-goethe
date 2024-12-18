import cloudbase from "@cloudbase/js-sdk/app";
import { registerAuth } from "@cloudbase/js-sdk/auth";
import { registerAi } from "@cloudbase/js-sdk/ai";

registerAuth(cloudbase);
registerAi(cloudbase);

App({
  globalData: {
    userInfo: null,
    ai: null,
    cloudApp: null
  },

  async onLaunch() {
    try {
      // 初始化云开发环境
      wx.cloud.init({
        env: 'wcmini-goethe-5gkgoxil4bab77bf',
        traceUser: true
      });

      // 初始化 cloudbase
      const app = cloudbase.init({
        env: 'wcmini-goethe-5gkgoxil4bab77bf'
      });
      
      this.globalData.cloudApp = app;
      const auth = app.auth({ persistence: "local" });
      await auth.signInWithOpenId();
      this.globalData.ai = await app.ai();

      console.log('AI初始化成功');
    } catch (error) {
      console.error('AI初始化失败:', error);
    }
  },

  // 获取AI实例，带重试机制
  async ai() {
    if (this.globalData.ai) {
      return this.globalData.ai;
    }

    // 如果AI实例不存在，尝试重新初始化
    try {
      if (!this.globalData.cloudApp) {
        this.globalData.cloudApp = cloudbase.init({
          env: 'wcmini-goethe-5gkgoxil4bab77bf'
        });
      }
      
      const auth = this.globalData.cloudApp.auth({ persistence: "local" });
      await auth.signInWithOpenId();
      this.globalData.ai = await this.globalData.cloudApp.ai();
      return this.globalData.ai;
    } catch (error) {
      console.error('AI重新初始化失败:', error);
      throw error;
    }
  }
});
