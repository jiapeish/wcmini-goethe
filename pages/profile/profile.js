Page({
  data: {
    userInfo: null,
    isLogin: false,
    nickName: '微信用户'
  },

  onLoad() {
    // 添加调试信息
    console.log('当前登录状态：', this.data.isLogin);
    
    // 使用绝对路径测试图片
    wx.getImageInfo({
      src: '/pages/images/ai-rabbit.png',  // 先测试已知可用的图片
      success: (res) => {
        console.log('ai-rabbit 加载成功：', res);
        
        // 再测试 default-avatar
        wx.getImageInfo({
          src: '/pages/images/default-avatar.png',
          success: (res2) => {
            console.log('default-avatar 加载成功：', res2);
          },
          fail: (err) => {
            console.log('default-avatar 加载失败：', err);
          }
        });
      },
      fail: (err) => {
        console.log('ai-rabbit 加载失败：', err);
      }
    });

    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        isLogin: true,
        nickName: userInfo.nickName
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

  // 处理头像选择
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    
    // 获取昵称
    wx.showModal({
      title: '请输入昵称',
      editable: true,
      placeholderText: '请输入昵称',
      success: (res) => {
        if (res.confirm) {
          const nickName = res.content || '微信用户';
          const userInfo = {
            avatarUrl: avatarUrl,
            nickName: nickName
          };
          
          // 保存用户信息
          this.setData({
            userInfo: userInfo,
            isLogin: true,
            nickName: nickName
          });
          
          // 保存到全局和本地存储
          getApp().globalData.userInfo = userInfo;
          wx.setStorageSync('userInfo', userInfo);
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        }
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
