// pages/recommend/recommend.js
Page({
  data: {
    userInput: '',
    apiResponse: ''
  },
  handleInput(e) {
    this.setData({
      userInput: e.detail.value
    })
  },
  sendMessage() {
    wx.request({
      url: 'https://openrouter.ai/',
      method: 'POST',
      data: {
        text: this.data.userInput
      },
      success: (res) => {
        this.setData({
          apiResponse: res.data
        })
      },
      fail: (err) => {
        console.error('API request failed:', err)
        this.setData({
          apiResponse: 'API request failed'
        })
      }
    })
  }
})
