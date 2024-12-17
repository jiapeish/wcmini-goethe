Page({
  data: {
    fontFamilies: [
      { name: '默认', value: 'default' },
      { name: '微软雅黑', value: 'Microsoft YaHei' },
      { name: '宋体', value: 'SimSun' },
      { name: '黑体', value: 'SimHei' }
    ],
    fontSizes: [
      { name: '小', value: 'small' },
      { name: '中', value: 'medium' },
      { name: '大', value: 'large' }
    ],
    colors: [
      { name: '黑色', value: '#333333' },
      { name: '深蓝', value: '#2c3e50' },
      { name: '深棕', value: '#34495e' },
      { name: '深紫', value: '#8e44ad' }
    ],
    settings: {
      fontFamily: 'default',
      fontSize: 'medium',
      wordColor: '#333333'
    },
    currentFontFamilyName: '默认',
    currentFontSizeName: '中',
    currentColorName: '黑色'
  },

  onLoad() {
    // 加载保存的设置
    const settings = wx.getStorageSync('wordCardSettings');
    if (settings) {
      this.setData({
        settings: settings
      });
      this.updateCurrentNames();
    }
  },

  // 更新当前选中项的显示名称
  updateCurrentNames() {
    const { settings, fontFamilies, fontSizes, colors } = this.data;
    
    const fontFamily = fontFamilies.find(item => item.value === settings.fontFamily);
    const fontSize = fontSizes.find(item => item.value === settings.fontSize);
    const color = colors.find(item => item.value === settings.wordColor);

    this.setData({
      currentFontFamilyName: fontFamily ? fontFamily.name : '默认',
      currentFontSizeName: fontSize ? fontSize.name : '中',
      currentColorName: color ? color.name : '黑色'
    });
  },

  // 选择字体
  handleFontFamilyChange(e) {
    const index = e.detail.value;
    const value = this.data.fontFamilies[index].value;
    this.updateSettings('fontFamily', value);
  },

  // 选择字体大小
  handleFontSizeChange(e) {
    const index = e.detail.value;
    const value = this.data.fontSizes[index].value;
    this.updateSettings('fontSize', value);
  },

  // 选择颜色
  handleColorChange(e) {
    const index = e.detail.value;
    const value = this.data.colors[index].value;
    this.updateSettings('wordColor', value);
  },

  // 更新设置
  updateSettings(key, value) {
    const { settings } = this.data;
    settings[key] = value;
    
    this.setData({ settings });
    this.updateCurrentNames();
    
    // 保存设置
    wx.setStorageSync('wordCardSettings', settings);
    
    // 显示保存成功提示
    wx.showToast({
      title: '设置已保存',
      icon: 'success'
    });
  },

  // 重置设置
  resetSettings() {
    const defaultSettings = {
      fontFamily: 'default',
      fontSize: 'medium',
      wordColor: '#333333'
    };

    this.setData({
      settings: defaultSettings
    });
    this.updateCurrentNames();

    wx.setStorageSync('wordCardSettings', defaultSettings);
    
    wx.showToast({
      title: '已恢复默认设置',
      icon: 'success'
    });
  }
});
