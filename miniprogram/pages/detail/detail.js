// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diet:{
      title:"未初始化的标题",
      calorie:"未初始化的卡路里",
      context:"未初始化的内容",
      note:"未初始化的备注"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var myDiet= {
      title:options.title,
      calorie:options.calorie,
      context:options.context,
      note:options.note?options.note:"无"//若options.note为""则note取"无"
    };
    console.log("打开饮食方案详情页面:",myDiet);
    this.setData({diet:myDiet});
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

  }
})