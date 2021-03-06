// miniprogram/pages/my/my.js
var app = getApp();

const db = wx.cloud.database();
// const testDB = wx.cloud.database({
//   env: 'test'
// })

//功能大体都全，求好心人实现一下my和detail粗糙界面的优化o(╥﹏╥)o
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:null,
    weight:null,
    bmi:"现在的数据计算不出yo",
    assess:" ",
    // 需要pages/cal中存在添加dietList的功能，接口已在cal.js中写明
    dietList:[]
  },

  //计算bmi，根据bmi变更assess
  calBMI: function(){
    console.log("[my.js] calBMI");
    var height = this.data.height;
    var weight = this.data.weight;
    if(height&&weight&&height>0&&weight>0){
      console.log("[my.js] calBMI passed, assess provided");
      let bmi_ = weight/(height*height);
      this.setData({
        bmi:bmi_
      });
      if(bmi_>10&&bmi_<18.5){
        this.setData({
          assess:"唔，有些瘦"
        });
      }else if(bmi_>=18.5&&bmi_<24){
        this.setData({
          assess:"不可思议，你很正常啊"
        });
      }else if(bmi_>=24&&bmi_<27){
        this.setData({
          assess:"重了点，重了点"
        });
      }else if(bmi_>=27&&bmi_<30){
        this.setData({
          assess:"轻度肥胖"
        });
      }else if(bmi_>=30&&bmi_<35){
        this.setData({
          assess:"中度肥胖"
        });
      }else if(bmi_>35&&bmi_<100){
        this.setData({
          assess:"重度肥胖"
        });
      }else{
        this.setData({
          assess:"呃，这数据异于常人，不好评价"
        });
      }
    }else{
      console.log("[my.js] calBMI failed");
      this.setData({
        bmi:"现在的数据计算不出yo",
        assess:""
      });
    }
  },

  //如果my.wxml中改为直接用双向绑定输入数据，则注释“失去焦点时才调用”的
  //这个inputData函数，并恢复my.wxml中bmi的计算按钮
  inputData:function(event){
    console.log("[my.js] inputData");
    var name = event.currentTarget.dataset.name;
    this.setData({
      [name]:event.detail.value
    });
    this.calBMI();
  },

  // 跳转向detail页面的同时传去“标题”数据，由detail页面搜索全局数据dietList并添加相应diet引用
  goToDetail: function(event){
    console.log("[my.js] goToDetail")
    var diet = event.currentTarget.dataset.diet;
   
    wx.navigateTo({
      url: `../detail/detail?title=${diet.title}`
    })
  },

  //利用globalData中dietList的引用，按index删除饮食方案列表中的一项
  deleteDiet:function(event){
    var index = event.currentTarget.dataset.index;
    var list = this.data.dietList;
    var to_delete = list[index];
    var my_title = to_delete["title"];
    console.log("删除饮食方案:",my_title);
    list.splice(index,1);
    this.setData({
      dietList:list
    });
    // wx.showLoading({
    //   title: '更新dietList中',
    // });

    db.collection('dietList').where({
      _openid: '{openid}',
      title: my_title
    })
    .get({
      success: res => {
        var id = res.data[0]._id;
        db.collection('dietList').doc(id).remove({
          success: res => {
            // app.updateWithCloudDietList();//此处重新读取dietList其实没有必要
            console.log("[my.js] deleteDiet删除云数据库数据成功:",res)
          },
          fail: err => {
            console.log("[my.js] deleteDiet删除云数据库数据失败:",err);
            // list.splice(index,0,to_delete);
            // this.setData({dietList:list});
            app.updateWithCloudDietList();//未知在删除过程中发生什么错误，故重读
          },
          complete: () => {
            // wx.hideLoading();
          }
        })
      },
      fail: err => {
        console.log("[my.js] deleteDiet获取删除对象id失败:",err);
        list.splice(index,0,to_delete);
        this.setData({
          dietList:list
        });
      }
    })
    
  },

  //在onLoad添加监听后，得以用全局属性updateDiet的访问器来刷新my页面中的dietList列表，参见app中watchDietList方法
  updateDiet:function(){
    console.log("[my.js] updateDiet");
    this.setData({
      dietList:app.globalData.dietList
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //若不在onLoad中setData而只是在data里写dietList:app.globalData.dietList的话
    //则若在my加载前用cal添加diet，再打开my页面，my中的dietList不会自动更新
    //(data里的初始值会在onLoad前赋好，但是没有成功传递引用吗？)
    console.log("dietList在onLoad前为:",this.data.dietList)
    this.setData({
      dietList:app.globalData.dietList
    })
    
    //监听全局属性updateDiet的访问来刷新my页面中的dietList列表，参见app中watchDietList方法
    let that = this;
    app.watchDietList(that.updateDiet);
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
    app.updateWithCloudDietList();
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