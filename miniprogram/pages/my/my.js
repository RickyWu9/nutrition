// miniprogram/pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:null,
    weight:null,
    bmi:0,
    dietList:[{title:"饮食方案名称",context:"内容",note:"备注"}]
  },

  calBMI: function(){
    console.log("calBMI");
    var height = this.data.height;
    var weight = this.data.weight;
    if(height&&weight){
      console.log("height,weight");
      this.setData({
        bmi:height==0?0:weight/(height*height)
      });
    }
  },

  inputData:function(event){
    console.log(event);
    let name = event.currentTarget.dataset.name;
    this.setData({
      [name]:event.detail.value
    });
  },

  goToDetail: function(event){
    console.log(event)
    var dataset = event.currentTarget.dataset;
   
    wx.navigateTo({
      url: `../detail/detail?title=${dataset.title}&context=${dataset.context}&note=${dataset.note}`
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

  }
})