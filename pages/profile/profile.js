Page({
  data: {
    userInfo: null,
    isLogin: false,
    nickName: '微信用户'
  },

  onLoad() {
    // 检查登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        isLogin: true,
        nickName: userInfo.nickName
      });
    }
  },

  // 处理登出
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除存储的用户信息
          wx.removeStorageSync('userInfo');
          
          // 更新全局数据
          getApp().globalData.userInfo = null;
          
          // 更新页面状态
          this.setData({
            userInfo: null,
            isLogin: false,
            nickName: '微信用户'
          });

          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 处理头像选择（登录）
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    
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
