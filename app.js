import cloudbase from "@cloudbase/js-sdk/app";
import { registerAuth } from "@cloudbase/js-sdk/auth";
import { registerAi } from "@cloudbase/js-sdk/ai";

registerAuth(cloudbase);
registerAi(cloudbase);

App({
  globalData: {
    userInfo: null,
    ai: null
  },

  async onLaunch() {
    // Initialize cloud environment
    wx.cloud.init({
      env: 'wcmini-goethe-5gkgoxil4bab77bf',
      traceUser: true
    });

    try {
      const app = cloudbase.init({
        env: 'wcmini-goethe-5gkgoxil4bab77bf'
      });
      
      const auth = app.auth({ persistence: "local" });
      await auth.signInWithOpenId();
      this.globalData.ai = await app.ai();
    } catch (error) {
      console.error('AI初始化失败:', error);
    }

    // Check if user is logged in
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }

    // Get system info for UI adaptation
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res;
      }
    });
  },

  onShow() {
    
  },

  onHide() {
    
  },

  // Get AI instance
  ai() {
    return this.globalData.ai;
  },

  // User login method
  login() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          const userInfo = res.userInfo;
          this.globalData.userInfo = userInfo;
          wx.setStorageSync('userInfo', userInfo);
          resolve(userInfo);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
});
