// pages/details/details.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    diet:{},
    title_modify:false,
    note_modify:false
  },

  //未经过充分测试，不确定是否完全正确，至少目前可用
  //解析name与obj中的结构，将value包装成能对obj赋值的对象返回
  //为使console简洁，evalObject不输出控制台信息
  evalObject:function(name,obj,value){
    var map = {};
    if(!name.indexOf('.')){
      map[name] = value;
      return map;
    }
    var nameList = name.split('.');
    var tmpMap = map;
    var tmpObj = obj;
    var evaluable = true;
    for(let i=0;i<nameList.length-1;i++){
      if(evaluable){
        if(tmpObj[nameList[i]]){
          tmpMap[nameList[i]] = tmpObj[nameList[i]];
          tmpObj = tmpObj[nameList[i]];
        }else{
          evaluable = false;
          tmpMap[nameList[i]] = {};
        }
      }else{
        tmpMap[nameList[i]] = {};
      }
      tmpMap = tmpMap[nameList[i]];
    }
    tmpMap[nameList[nameList.length-1]] = value;
    return map;
  },

  //为this.data中的name赋值value,同时更新my页面,该方法允许name中有多个'.'(如果evalObject没写错)
  settingData:function(name,value){
    var map = this.evalObject(name,this.data,value);
    console.log("settingData:",map);
    this.setData(map);
  },

  //在失去焦点时，动态地、有条件地更新某属性，同时使组件回到非修改状态
  modifyEnd:function(event){
    console.log("modifyEnd");
    var dataset = event.currentTarget.dataset;
    if(event.detail.value||dataset.empty){//empty为true代表可以为空值
      this.settingData(dataset.name,event.detail.value);
    }
    this.settingData(dataset.state,false);
  },

  //因为title不能重复，所以更改标题的方法需要另写
  titleModifyEnd:function(event){
    console.log("titleModifyEnd");
    var dataset = event.currentTarget.dataset;
    var value = event.detail.value;
    if(value){
      if(app.uniq_diet(value)){
        this.settingData(dataset.name,value);
        app.globalData.updateDiet;
      }else if(value!=this.data.diet.title){
        wx.showToast({
          title: "标题已存在哦",//最多七个汉字长度
          icon: "none",
          duration: 2000
      });
      }
    }
    this.settingData(dataset.state,false);
  },

  //动态触发某组件的修改状态
  modifyStart:function(event){
    console.log("modifyStart");
    var state = event.currentTarget.dataset.state;
    this.settingData(state,true);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title = options.title;
    var dietList = app.globalData.dietList;
    var myDiet = {
      title:"未初始化的标题",
      calorie:"未初始化的卡路里",
      context:"未初始化的内容",
      note:"未初始化的备注"
    };
    for(let i=0;i<dietList.length;i++){
      if(dietList[i].title==title){
        myDiet = dietList[i];
      }
    }
    this.setData({diet:myDiet});
    console.log("打开饮食方案详情页面:",myDiet);
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