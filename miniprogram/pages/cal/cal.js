
var shopList = require('./shopList.js');

Page({

  data: {
    showView:false,

    showCartDetail: false,

    list: [],//商品列表

    classifyViewed: '',//默认顶部

    buyNum: {},

    cart: [],

    surplusNum: {},

    sumMoney: 0.00, //购买总价

    buySum: 0//购买总数

  },



  /**

   * 初始加载获取商品数据

   */

  onLoad: function () {
    //请求后台得来的商品list，在这里就不写怎么获取的
    //在同级包下写了一个数据的js先引用讲解
    var list = shopList.List;
    // 购买商品的数量
    var data = { buyNum: {} };
    // 判断商品剩余使用，商品id为键 商品剩余为值
    var surplusNum = {};
    for (let i in list) {
      var id = list[i].id;
      // 更换商品种类（id不能以数字开头）
      list[i].id = 'a' + id;
      var goods = list[i].goods;
      for (let j in goods) {
        //拼接商品的图片,这里写死了开发过程中要写成配置文件
        goods[j].image = goods[j].image;
        data.buyNum[goods[j].id] = 0;
        surplusNum[goods[j].id] = goods[j].surplusNum;//判断商品剩余
      }
    }
    //原始list存入data中方便页面遍历
    data.list = list;
    this.setData(data);
    this.setData({
      surplusNum: surplusNum,
      //作为一个比较的商品剩余
      surplusnumInfo: surplusNum,
      //默认一个商品种类选中
      classifySeleted: list[0].id
    });   
  },
  //加
  add: function (e) {

    var detail = e.currentTarget.dataset.detail;//是否来自商品列表还是购物车

    var productId, classGoodsIndex, goodsIndex, image, rebatePrice, price, productName;

    if (detail == 'cart') {//购物车的加号

      productId = e.currentTarget.dataset.id;

      productName = e.currentTarget.dataset.name;

      price = e.currentTarget.dataset.price;

    } else {

      productId = e.target.dataset.id;

      classGoodsIndex = e.target.dataset.classgoodsindex;//商品种类的下标

      goodsIndex = e.target.dataset.goodsindex;//商品的下标

      image = this.data.list[classGoodsIndex].goods[goodsIndex].image;//商品图片

      rebatePrice = this.data.list[classGoodsIndex].goods[goodsIndex].rebatePrice;//优惠价格

      price = this.data.list[classGoodsIndex].goods[goodsIndex].standardPrice;//售价

      productName = this.data.list[classGoodsIndex].goods[goodsIndex].name;//商品名字

    }

    //判断优惠价格,没有util包先简单判断一下

    if (rebatePrice != null && rebatePrice != '') {

      price = rebatePrice;

    }

    var arrId = [];//商品id集合

    var arr = this.data.cart || [];

    //判断商品剩余(第一次加入购物车肯定没有所以加一)

    if (0== this.data.surplusnumInfo[productId]) {

      wx.showToast({

        icon: 'none',

        title: '添加过多！请合理搭配哦！',

      })

      return false;

    }

    var buyCount = 1;

    //第一次加入商品

    if (arr.length == 0) {

      arr.push({

        id: productId,

        name: productName,

        price: price,

        buyCount: buyCount,

        buyMoney: this.buyOneMoney(price, buyCount),

        standardSellingPrice: this.data.list[classGoodsIndex].goods[goodsIndex].standardPrice,

        image: image

      });

    } else if (arr.length >= 1) {

      //商品id集合

      for (let g in arr) {

        arrId.push(arr[g].id);

      }

      //商品已存在的判断

      if (arrId.indexOf(productId) != -1) {

        for (let g in arr) {

          if (arr[g].id == productId) {

            arr[g].buyCount += 1;

            buyCount = arr[g].buyCount;

            arr[g].buyMoney = this.buyOneMoney(arr[g].price, arr[g].buyCount)

            break;

          }

        }

      } else {

        arr.push({

          id: productId,

          name: productName,

          price: price,

          buyCount: buyCount,

          buyMoney: this.buyOneMoney(price, buyCount),

          image: image

        });

      }

    }

    var data = { buyNum: this.data.buyNum };

    data.buyNum[productId] = buyCount;

    //用来显示加减购物的数量显示

    this.data.buyNum[productId] = buyCount;

    this.setData(data);



    //用于底部显示

    this.setData({

      sumMoney: this.buySumMoney(arr),

      cart: arr,

      buySum: this.buySum(arr),

    });

    //清空商品id集合

    arrId = [];

    //判断商品剩余与购买的数量

    var surplusnum = this.data.surplusNum;

    for (var i in surplusnum) {

      if (productId == i && surplusnum[i] != 0) {

        if (surplusnum[i] >=0 ) {

          let count = surplusnum[i] - 1;

          if (count <= 0) {

            surplusnum[i] = 0;

            break;

          } else {

            surplusnum[i] = count;

            break;

          }

        } else {

          break;

        }

      }

    }

    //更新商品剩余

    this.setData({

      surplusNum: surplusnum

    })

  },
  //减
  subtract: function (e) {

    console.log('点击减号')

    var productId = e.target.dataset.id

    var arrId = [];

    var buyCount = 0;

    //判断商品剩余

    // if (this.data.surplusNum[productId] >= this.data.surplusnumInfo[productId]) {

    //   return false;

    // }

    var arr = this.data.cart || [];

    if (arr.length > 0) {

      for (let i in arr) {

        arrId.push(arr[i].id);

      }

      //商品在购物车中存在

      if (arrId.indexOf(productId) != -1) {

        for (let g in arr) {

          if (arr[g].id == productId) {

            arr[g].buyCount -= 1;

            buyCount = arr[g].buyCount;

            arr[g].buyMoney = this.buyOneMoney(arr[g].price, arr[g].buyCount)

          }

          if (arr[g].buyCount <= 0) {

            this.removeByValue(arr, arr[g].id);

          }

        }

      }

    }

    //判断购物车的商品

    if (arr.length <= 0) {

      this.setData({

        cart: []

      })

    } else {

      this.setData({

        cart: arr

      })

    }



    var data = { buyNum: this.data.buyNum };

    data.buyNum[productId] = buyCount;

    //用来显示加减购物的数量显示

    this.data.buyNum[productId] = buyCount;

    this.setData(data);

    this.setData({

      sumMoney: this.buySumMoney(arr),

      cart: arr,

      buySum: this.buySum(arr),

    });

    //清空商品id集合

    arrId = [];

    //判断剩余数量(剩余数量)

    var surplusnum = this.data.surplusNum;

    for (var i in surplusnum) {

      if (productId == i && this.data.buyNum[i] >= 0) {

        let count = surplusnum[i] + 1;

        surplusnum[i] = count;

        break;

      }

    }

    //更新商品剩余

    this.setData({

      surplusNum: surplusnum

    })

  },
  //清空
  clear: function(e){
    
    console.log("清空清空")
    
    var list=shopList.List
    
    for(let i in list){      
      var goods=list[i].goods
      for(let j in goods){
        this.data.buyNum[goods[j].id]=0
        this.data.surplusNum[goods[j].id]=goods[j].surplusNum
        
      }
    }
    
    var data={
      sumMoney:0,
      cart:[],
      buyNum: this.data.buyNum,
      surplusNum: this.data.surplusNum,  
      buySum: 0
    }
    this.setData(data);
    
    
  },
  onView: function(e){
    this.setData({
      showView:true
    })
   
  },
  offView:function(e){
    this.setData({
      showView:false
    })
  },


  submit: function (array) { 
    console.log(array);
    //组装饮食方案的内容
    var my_context = "";
    var food = this.data.cart;
    for(let i=0;i<food.length;i++){
      my_context += (food[i]["name"]+"x"+food[i]["buyCount"]+";")
    }
    console.log("my_context",my_context)
    //class='name'
    //数据格式如下diet所示，均为字符串类型，其中title为主键，title重复时会插入失败
    //detail详情页中context的显示方式为<text decode="{{true}}" space="nbsp">{{diet.context}}</text>
    let newDiet = {
      title:"41512315",//主键//getname
      calorie:this.data.sumMoney+"千卡",//需要自带单位
      context:my_context,//由选定食物组成，仅在detail页面显示
      note:""//为食谱的备注，该功能不实现时note需要取""或undefined(此时detail页面备注为"无")，仅在detail页面显示
    };
    //添加diet功能实现如下所示
    let app = getApp(); 
    console.log("添加饮食方案:",newDiet);
    if(!app.add_diet(newDiet)){
      wx.showToast({
        title: "标题已存在哦",//最多七个汉字长度
        icon: "none",
        duration: 2000
      });
    }else{
      wx.showToast({
        title: "添加成功",//最多七个汉字长度
        icon: "none",
        duration: 2000
      });
      this.clear()
    }
  },



  //购买总数

  buySum: function (array) {

    var sum = 0;

    for (var g in array) {

      if (array[g].buyCount >= 0) {

        sum += array[g].buyCount;

      } else {

        return sum;

      }

    }

    return sum;

  },



  //单个商品总价

  buyOneMoney: function (price, buyCount) {

    if (buyCount <= 0) {

      return 0.0;

    } else {

      return parseFloat(price * buyCount * 10000000 / 10000000).toFixed(1);

    }

  },



  //购买总价

  buySumMoney: function (array) {

    var sum = 0.0;

    for (let g in array) {

      if (array[g].buyCount >= 0) {

        sum += (array[g].buyCount * array[g].price * 10000000 / 10000000);

      } else {

        return sum;

      }

    }

    return parseFloat(sum).toFixed(1);

  },



  //定义根据id删除数组的方法

  removeByValue: function (array, val) {

    for (let i = 0; i < array.length; i++) {

      if (array[i].id == val) {

        array.splice(i, 1);

        break;

      }

    }

  },



  //左右关系联动

  onGoodsScroll: function (e) {

    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {

      this.setData({

        scrollDown: true

      });

    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {

      this.setData({

        scrollDown: false

      });

    }

    var scale = e.detail.scrollWidth / 570,

      scrollTop = e.detail.scrollTop / scale,

      h = 0,

      classifySeleted,

      len = this.data.list;



    var list = this.data.list;

    for (let i in list) {

      //商品的高度也是根据总体的scrow-view来算的

      var goodsHeight = 70 + list[i].goods.length * (46 * 3 + 20 * 2);

      if (scrollTop >= h - 100 / scale) {

        classifySeleted = list[i].id;

      }

      h += goodsHeight;

    }

    this.setData({

      classifySeleted: classifySeleted

    });

  },



  //左侧点击事件

  tapClassify: function (e) {

    var id = e.target.dataset.id;

    this.setData({

      classifyViewed: id

    });

    var self = this;

    setTimeout(function () {

      self.setData({

        classifySeleted: id

      });

    }, 100);

  },



  //底部购物车显示

  showCartDetail: function () {

    this.setData({

      showCartDetail: !this.data.showCartDetail

    });

  },



  hideCartDetail: function () {
    this.setData({showCartDetail: false});
  },

});
