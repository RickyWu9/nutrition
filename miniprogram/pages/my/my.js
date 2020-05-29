// miniprogram/pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:null,
    weight:null,
    bmi:"现在的数据计算不出yo",
    dietList:[
    {title:"饮食方案名称1",brief:"简介1",context:"内容1",note:"备注1"},
    {title:"饮食方案名称2",brief:"简介2",context:"内容2",note:"备注2"},
    {title:"饮食方案名称3",brief:"简介3",context:"内容3",note:"备注3"},
    {title:"饮食方案名称4",brief:"简介4",context:"内容4",note:"备注4"},
    {title:"饮食方案名称5",brief:"简介5",context:"内容5",note:"备注5"}
    ]
  },

  calBMI: function(){
    console.log("calBMI");
    var height = this.data.height;
    var weight = this.data.weight;
    if(height&&weight&&height>0&&weight>0){
      console.log(height,weight);
      this.setData({
        bmi:weight/(height*height)
      });
    }else{
      console.log("calBMI failed");
      this.setData({
        bmi:"现在的数据计算不出yo"
      });
    }
  },

  inputData:function(event){
    console.log(event);
    var name = event.currentTarget.dataset.name;
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

  deleteDiet:function(event){
    console.log(event);
    var list = this.data.dietList;
    var index = event.currentTarget.dataset.index;
    list.splice(index,1);
    this.setData({
      dietList:list
    });
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