// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*
    articleList:[
      {route:"../articles/article1/article1",title:"张文宏建议不要喝粥，是怎么回事",brief:"粥的营养价值有限，除了碳水化合物，我们还需要蛋白质、脂肪、维生素、电解质等营养物质，而单纯喝粥是远远不够的。"},
  ]
  */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleList()
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
    this.getArticleList()
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

  getArticleList:function(){
    wx.cloud.callFunction({
      name:'getArticleList',
    }).then(res=>{
      console.log(res)
      this.setData({articleList:res.result.data})
  })
 /*
 const db=wx.cloud.database()
 db.collection('articleList').get().then(res=>{console.log(res.data)})
 */
  },

  goToArticle: function(event){
    console.log(event)
    wx.navigateTo({
      url: event.currentTarget.dataset.route
    })
  }

})