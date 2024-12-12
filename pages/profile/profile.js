// pages/profile/profile.js
Page({
  data: {
    userInfo: null,
    points: 100  // Set default points to 100
  },

  onLoad() {
    // Check if user is already logged in
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        points: 100  // Always show 100 points
      });
    }
  },

  handleLogin() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        console.log('Login success:', res);
        const userInfo = res.userInfo;
        
        // Save user info to storage
        wx.setStorageSync('userInfo', userInfo);
        
        // Update page state
        this.setData({
          userInfo: userInfo,
          points: 100  // Set points to 100 after login
        });

        // Show success toast
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('Login failed:', err);
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },

  // Handle menu item clicks
  handleMenuClick(e) {
    const menuText = e.currentTarget.dataset.menu;
    
    if (menuText === '我的积分') {
      if (!this.data.userInfo) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }
    }
  }
});
