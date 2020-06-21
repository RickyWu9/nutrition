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

    this.globalData = {};

    this.getDietList();

    // 不知道监听如何使用，发现仅在重新加载后更新，暂弃
    // const db = wx.cloud.database()
    // const _ = db.command
    // db.collection('dietList').where({
    //   _openid: '{openid}'
    // }).watch({
    //   onChange: snapshot => {
    //     this.getDietList();
    //     console.log(`dietList云数据库更新`, snapshot);
    //     this.globalData.updateDiet;
    //   },
    //   onError: err => {
    //     console.error(`监听错误`, err);
    //   }
    // })
  },

  updateWithCloudDietList:function(method){
    this.getDietList(this.updateMethod(method));
  },

  updateMethod:function(method){
    var that = this;
    return function(){
      if(method){
        method();
      }
      that.globalData.updateDiet;
    };
  },

  //获取云数据库中dietList
  getDietList:function(method){
    console.log("载入云数据库dietList")
    const MAX_LIMIT = 20;//从云数据库读数据一次最多20个
    const db = wx.cloud.database();
    var has_loaded = 0;
    var that = this;
    // 先取出集合记录总数
    db.collection('dietList').where({
      _openid: '{openid}'//因为当前云数据库中设置了默认此条成立，所以不写也可以
    }).count({
      success: function(res) {
        // 计算需分几次取
        const batchTimes = Math.ceil(res.total / MAX_LIMIT);
        console.log("batchTimes:",batchTimes);
        var read = [];
         // 异步获取所有dietList
        for (let i = 0; i < batchTimes; i++) {
          db.collection('dietList').where({
            _openid: '{openid}'//因为当前云数据库中设置了默认此条成立，所以不写也可以
          }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get({
            success: res => {
              read.push([i,res.data]);//将读取的序号随数据一同传入
              has_loaded++;
              console.log("success in loading",i);
              if(has_loaded==batchTimes){
                //根据序号重新排列dietList
                let list = [];
                for(let i=0;i<read.length;i++){
                  let tmpList = [];
                  for(let j=0;j<read.length;j++){
                    if(read[j][0]==i){
                      tmpList = read[j][1];
                      break;
                    }
                  }
                  list = list.concat(tmpList)
                }
                console.log("all loaded")
                console.log("list",list)
                //this失效，用传入的that赋值
                that.globalData.dietList = list;
                if(method){
                  method();
                }
              }
            },
            fail: err => {
              console.error('err', err)
            }
          });
        }
      }
    })
  },

  //利用setter/getter访问器绑定my中page的引用到app中updateDiet属性上，
  //使得updateDiet的访问器被调用时my立刻发现并做出即时行为(如刷新my页面中dietList),实现watch监听函数效果
  watchDietList:function(method){
    console.log("watch added to dietList");
    var obj = this.globalData;
    Object.defineProperty(obj,"updateDiet", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        console.log("利用updateDiet的setter更新my页面(",value,"未使用)");
        method();
      },
      get:function(){
        console.log("利用updateDiet的getter更新my页面(返回值为null)");
        method();
        return null;
      }
    })
  },

  //待改
  add_diet:function(newDiet){
    console.log("添加饮食方案:",newDiet);
    if(!this.uniq_diet(newDiet.title)){
      console.log("insert failed");
      return false;
    }
    const db = wx.cloud.database();
    var that = this;
    db.collection('dietList').add({
      // data 字段表示需新增的 JSON 数据
      data: newDiet,
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        that.updateWithCloudDietList();
        console.log("add_diet插入云数据库成功")
      },
      fail: function(err){
        console.log(err);
      },
      // complete: console.log
    })
    return true;
  },

  //勿改，此方法在detail.js中被调用
  uniq_diet:function(title){
    var list = this.globalData.dietList;
    for(let i=0;i<list.length;i++){
      if(list[i].title==title){
        return false;
      }
    }
    return true;
  }
})
