// miniprogram/pages/cal/cal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [],
    list: [],

    list01: [
      { item_id: 1 }, { item_id: 11 }, { item_id: 11 },
    ],
    list02: [

    ],
    list03: [
      { item_id: 11 }, { item_id: 11 }
    ],
    list04: [
      { item_id: 11 }, { item_id: 11 }, { item_id: 11 }
    ],

  // 展开折叠
    selectedFlag: [false, false, false, false],

  },
    // 展开折叠选择  
  changeToggle:function(e){
    var index = e.currentTarget.dataset.index;
    if (this.data.selectedFlag[index]){
      this.data.selectedFlag[index] = false;
    }else{
      this.data.selectedFlag[index] = true;
    }

    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
   a: function () {

  },
  input(e) {
    this.search(e.detail.value)
  },
  search(key) {
    var that = this;
    //从本地缓存中异步获取指定 key 的内容
    var list = wx.getStorage({
      key: 'list',
      //从Storage中取出存储的数据
      success: function (res) {
        // console.log(res)
        if (key == '') { //用户没有输入时全部显示
          that.setData({
            list: res.data
          })
          return;
        }
        var arr = []; //临时数组，用于存放匹配到的数组
        for (let i in res.data) {
          if (res.data[i].name.indexOf(key) >= 0) {
            arr.push(res.data[i])
          }
        }
        if (arr.length == 0) {
          that.setData({
            list: [{ name: '没有相关数据！' }]
          })
        } else {
          that.setData({
            list: arr
          })
        }
      },
    })
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var list = [
      { name: "大米" },
      { name: "小米" },
      { name: "面条" },
      { name: "猪肉" }
    ]
    wx.setStorage({
      key: 'list',
      data: list
    })
    this.setData({
      list: list
    })
  },
})