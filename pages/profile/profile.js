Page({
  data: {
    userInfo: null,
    points: 100,
    favoriteCount: 0
  },

  onLoad() {
    // Check if user is already logged in
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        points: 100
      });
    }
  },

  onShow() {
    // 更新收藏数量
    this.updateFavoriteCount();
  },

  updateFavoriteCount() {
    try {
      const favorites = wx.getStorageSync('favoriteWords') || [];
      this.setData({
        favoriteCount: favorites.length
      });
    } catch (error) {
      console.error('Failed to get favorite count:', error);
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
          points: 100
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
    
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    switch (menuText) {
      case '我的学习记录':
        wx.navigateTo({
          url: '/pages/study-history/study-history'
        });
        break;
      case '我的收藏':
        wx.navigateTo({
          url: '/pages/favorites/favorites'
        });
        break;
      case '我的积分':
        wx.showToast({
          title: '当前积分：' + this.data.points,
          icon: 'none'
        });
        break;
      case '设置':
        wx.navigateTo({
          url: '/pages/settings/settings'
        });
        break;
    }
  }
});
