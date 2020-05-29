// miniprogram/pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:null,
    weight:null,
    bmi:"现在的数据计算不出yo",
    // 需要pages/cal中存在添加dietList的功能，cal的逻辑设计取决于下方接口描述
    // 传递的数据包括下方dietList实例中的四个属性，其中title为主键，cal在插入数据时要检查title是否重复
    // 已有addDiet函数且功能包括title检查，但不确定是否正确以及可用
    // detail详情页中context的显示方式为<text decode="{{true}}" space="nbsp">{{diet.context}}</text>
    dietList:[
    {title:"饮食方案名称1",brief:"简介1",context:"内容1",note:"备注1"},
    {title:"饮食方案名称2",brief:"简介2",context:"内容2",note:"备注2"},
    {title:"饮食方案名称3",brief:"简介3",context:"内容3",note:"备注3"},
    {title:"饮食方案名称4",brief:"简介4",context:"内容4",note:"备注4"},
    {title:"饮食方案名称5",brief:"简介5",context:"内容5",note:"备注5"}
    ]
  },

  //计算bmi
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

  //如果my.wxml中改为直接用双向绑定输入数据，则注释“失去焦点时才调用”的
  //这个inputData函数，并恢复my.wxml中bmi的计算按钮
  inputData:function(event){
    console.log(event);
    var name = event.currentTarget.dataset.name;
    this.setData({
      [name]:event.detail.value
    });
    this.calBMI();
  },

  // 跳转向detail页面的同时传去“标题、内容和备注”三项数据
  goToDetail: function(event){
    console.log(event)
    var dataset = event.currentTarget.dataset;
   
    wx.navigateTo({
      url: `../detail/detail?title=${dataset.title}&context=${dataset.context}&note=${dataset.note}`
    })
  },

  //按index删除饮食方案列表中的一项
  deleteDiet:function(event){
    console.log(event);
    var list = this.data.dietList;
    var index = event.currentTarget.dataset.index;
    list.splice(index,1);
    this.setData({
      dietList:list
    });
  },

  //不确定是否正确的addDiet函数
  addDiet:function(newDiet){
    console.log("addDiet");
    var list = this.data.dietList;
    for(diet in list){
      if(diet.title==newDiet.title){
        console.log("insert failed");
        return;
      }
    }
    list.push(newDiet);
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