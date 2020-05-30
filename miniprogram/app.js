//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    wx.cloud.init({
      traceUser: true,
    })

    this.globalData = {
      //dietList中是供测试用的diet项,投入使用前需将dietList表清空
      dietList:[
        {title:"饮食方案名称1",calorie:"calorie1",context:"内容1",note:""},
        {title:"饮食方案名称2",calorie:"calorie2",context:"内容2",note:"0"},
        {title:"饮食方案名称3",calorie:"calorie3",context:"内容3",note:undefined},
        {title:"饮食方案名称4",calorie:"calorie4",context:"内容4",note:"null"},
        {title:"饮食方案名称5",calorie:"calorie5",context:"内容5",note:"备注5"}
        ]
    }
  },

  //利用setter访问器绑定my中page的引用到app中addDiet属性上，
  //使得addDiet变动时my立刻发现并做出即时行为(如刷新my页面中dietList),实现watch监听函数效果
  watchDietList:function(method){
    console.log("watch added to dietList");
    var obj = this.globalData;
    Object.defineProperty(obj,"addDiet", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        console.log("利用addDiet的setter更新my页面");
        method();
      },
      get:function(){
        console.log("storage of addDiet not provided");
        return null;
      }
    })
  },

  add_diet:function(newDiet){
    console.log("添加饮食方案:",newDiet);
    var list = this.globalData.dietList;
    for(let i=0;i<list.length;i++){
      if(list[i].title==newDiet.title){
        console.log("insert failed");
        return false;
      }
    }
    list.push(newDiet);

    //因为希望添加diet时返回布尔值，所以另写了一个函数add_diet，
    //这使得addDiet本身的setter失去原来意义(下面等式右边的值无用)，只是为了触发my的更新
    this.globalData.addDiet = newDiet;

    return true;
  }
})
