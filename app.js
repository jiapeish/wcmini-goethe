//app.js
App({
  globalData: {
    userInfo: null
  },

  onLaunch() {
    // Initialize cloud environment
    wx.cloud.init({
      env: 'prod-3gq9kpp7b8085f19',
      traceUser: true
    });

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
    
  }
});
