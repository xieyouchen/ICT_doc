//index.js
//获取应用实例
const app = getApp()
const DB1 = wx.cloud.database().collection("IOT_Doctor")
const DB2 = wx.cloud.database().collection("IOT_Patient")
let mynote = []
let userdata = [];
Page({
    data: {
      doctor:{
        img:'../../icon/doc.jpg',
        name:'xyc',
        registerTime:'2022-11-18'
      },
        users: [],
        mode:-1,
    //    itemList:['病人', '医生'],
    //用户的openid
        user: null,
    //用户的个人信息
        user_detail:{
          mydata:[{
            today:[
              {
              img:'cloud://iotble-7gfknqxg35e663ca.696f-iotble-7gfknqxg35e663ca-1314055828/_2012undefinedundefinedundefined.png',
              data: [36,65,30 ,78 ,40, 33, 18],
              tag:'早'
            },
            {
              img:'cloud://iotble-7gfknqxg35e663ca.696f-iotble-7gfknqxg35e663ca-1314055828/_2012undefinedundefinedundefined.png',
              data: [65,30 ,78 ,40, 33, 18, 36],
              tag:'中'
            },
            {
              img:'cloud://iotble-7gfknqxg35e663ca.696f-iotble-7gfknqxg35e663ca-1314055828/_2012undefinedundefinedundefined.png',
              data: [30 ,78 ,40, 33, 18, 36, 65],
              tag:'晚'
            }],
            year: '2022',
            month: '11',
            day: '18'
          },{
            today:[
              {
              img:'cloud://iotble-7gfknqxg35e663ca.696f-iotble-7gfknqxg35e663ca-1314055828/_2012undefinedundefinedundefined.png',
              data: [36,65,30 ,78 ,40, 33, 18],
              tag:'早'
            },
            {
              img:'cloud://iotble-7gfknqxg35e663ca.696f-iotble-7gfknqxg35e663ca-1314055828/_2012undefinedundefinedundefined.png',
              data: [65,30 ,78 ,40, 33, 18, 36],
              tag:'中'
            },
            {
              img:'cloud://iotble-7gfknqxg35e663ca.696f-iotble-7gfknqxg35e663ca-1314055828/_2012undefinedundefinedundefined.png',
              data: [30 ,78 ,40, 33, 18, 36, 65],
              tag:'晚'
            }],
            year: '2022',
            month: '11',
            day: '19'
          },
          {
            today:[
              {
              img:'cloud://iotble-7gfknqxg35e663ca.696f-iotble-7gfknqxg35e663ca-1314055828/_2012undefinedundefinedundefined.png',
              data: [36,65,30 ,78 ,40, 33, 18],
              tag:'早'
            },
            {
              img:'cloud://iotble-7gfknqxg35e663ca.696f-iotble-7gfknqxg35e663ca-1314055828/_2012undefinedundefinedundefined.png',
              data: [65,30 ,78 ,40, 33, 18, 36],
              tag:'中'
            },
            {
              img:'cloud://iotble-7gfknqxg35e663ca.696f-iotble-7gfknqxg35e663ca-1314055828/_2012undefinedundefinedundefined.png',
              data: [30 ,78 ,40, 33, 18, 36, 65],
              tag:'晚'
            }],
            year: '2022',
            month: '11',
            day: '20'
          }
        ]
        },
        index: null,
        defaultimg: "/icon/LOGO.jpg",
        my_likes:[],
        my_collects:[],
        current_index:null,
        ready: false,
        motto: 'Hello World',
        my_note: [],
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        tabs: [{
                id: 0,
                name: "基本信息",
                isactive: false
            },
            {
                id: 1,
                name: "近期建议",
                isactive: false
            }
        ],
        ispatient: true,
        flag: app.globalData.haveFlag,
        toTabs: 1
    },
    // cloud_get_mynote() {
    //     var _this = this;
    //     // console.log("openid", _this.data.userInfo);
    //     wx.cloud.callFunction({
    //         name: "get_my_note",
    //         data: {
    //             open_id: _this.data.userInfo.open_ID
    //         },
    //         success: function(res) {
    //             userdata = res.result.data;
    //             let mylikes=[];
    //             let mycollects=[];
    //             let user=_this.data.userInfo.open_ID
    //             console.log(userdata.length)
    //             for(var i=0;i<userdata.length;i++){
    //                 if(userdata[i].hasOwnProperty("likes"))
    //                 {
    //                     //console.log("yes")
    //                     let likelist=userdata[i].like_list
    //                     console.log("user",user)
    //                     if(userdata[i].hasOwnProperty("like_list"))
    //                     {
    //                     if(likelist.includes(user)){
    //                         //mylikes[i]=true
    //                         userdata[i].my_likes=true
    //                     }
    //                 }
    //                 else{
    //                     userdata[i]["like_list"]=[]
    //                 }
    //                 }
    //                 else{
    //                     userdata[i]["likes"]=0;
    //                     userdata[i]["like_list"]=[]
    //                     console.log("no")
    //                 }
    //                 if(userdata[i].hasOwnProperty("collects"))
    //                 {
    //                     console.log("yes")
    //                     let collectlist=userdata[i].collect_list
    //                     console.log("user",user)
    //                     if(userdata[i].hasOwnProperty("collect_list"))
    //                     {
    //                     if(collectlist.includes(user)){
    //                        // mycollects[i]=true
    //                         userdata[i].my_collects=true
    //                     }
    //                 }
    //                 else{
    //                     userdata[i]["collect_list"]=[]
    //                 }
    //                 }
    //                 else{
    //                     userdata[i]["collects"]=0;
    //                     userdata[i]["collect_list"]=[]
    //                     console.log("no")
    //                 }
    //                 if(userdata[i].hasOwnProperty("comments"))
    //                 {
    //                     console.log("yes")
    //                 }
    //                 else{
    //                     userdata[i]["comments"]=0;
    //                     console.log("no")
    //                 }
    //                 if(userdata[i].hasOwnProperty("my_likes"))
    //                 {
    //                     console.log("yes")
    //                     mylikes.push(userdata[i].my_likes);
    //                    // continue;
    //                 }
    //                 else{
    //                     userdata[i]["my_likes"]=false;
    //                     mylikes.push(false);
    //                     console.log("no")
    //                 }
    //                 if(userdata[i].hasOwnProperty("my_collects"))
    //                 {
    //                     console.log("yes")
    //                     mycollects.push(userdata[i].my_collects);
    //                    // continue;
    //                 }
    //                 else{
    //                     userdata[i]["my_collects"]=false;
    //                     mycollects.push(false);
    //                     console.log("no")
    //                 }
    //             }
    //             _this.setData({
    //                 my_note: userdata,
    //                 my_likes:mylikes,
    //                 my_collects:mycollects
    //             })
    //             console.log("success", userdata,mycollects)
    //             // _this.setData({
    //             //     my_note: mynote
    //             // })
    //            // console.log("success", mynote)
    //         },
    //         fail(res) {
    //             console.log("fail", res)
    //         }
    //     })
    // },
    
    
    // cloudgetdata() {
    //     var _this = this;
    //     wx.cloud.callFunction({
    //         name: "get_from_database",
    //         data: {
    //             index: _this.data.index
    //         },
    //         success: function(res) {
    //             userdata = res.result.data;
    //             let mylikes=[];
    //             let mycollects=[];
    //             let user=_this.data.user
    //             console.log(userdata.length)
    //             for(var i=0;i<userdata.length;i++){
    //                 if(userdata[i].hasOwnProperty("likes"))
    //                 {
    //                     //console.log("yes")
    //                     let likelist=userdata[i].like_list
    //                     console.log("user",user)
    //                     if(userdata[i].hasOwnProperty("like_list"))
    //                     {
    //                     if(likelist.includes(user)){
    //                         //mylikes[i]=true
    //                         userdata[i].my_likes=true
    //                     }
    //                 }
    //                 else{
    //                     userdata[i]["like_list"]=[]
    //                 }
    //                 }
    //                 else{
    //                     userdata[i]["likes"]=0;
    //                     userdata[i]["like_list"]=[]
    //                     console.log("no")
    //                 }
    //                 if(userdata[i].hasOwnProperty("collects"))
    //                 {
    //                     console.log("yes")
    //                     let collectlist=userdata[i].collect_list
    //                     console.log("user",user)
    //                     if(userdata[i].hasOwnProperty("collect_list"))
    //                     {
    //                     if(collectlist.includes(user)){
    //                        // mycollects[i]=true
    //                         userdata[i].my_collects=true
    //                     }
    //                 }
    //                 else{
    //                     userdata[i]["collect_list"]=[]
    //                 }
    //                 }
    //                 else{
    //                     userdata[i]["collects"]=0;
    //                     userdata[i]["collect_list"]=[]
    //                     console.log("no")
    //                 }
    //                 if(userdata[i].hasOwnProperty("comments"))
    //                 {
    //                     console.log("yes")
    //                 }
    //                 else{
    //                     userdata[i]["comments"]=0;
    //                     console.log("no")
    //                 }
    //                 if(userdata[i].hasOwnProperty("my_likes"))
    //                 {
    //                     console.log("yes")
    //                     mylikes.push(userdata[i].my_likes);
    //                    // continue;
    //                 }
    //                 else{
    //                     userdata[i]["my_likes"]=false;
    //                     mylikes.push(false);
    //                     console.log("no")
    //                 }
    //                 if(userdata[i].hasOwnProperty("my_collects"))
    //                 {
    //                     console.log("yes")
    //                     mycollects.push(userdata[i].my_collects);
    //                    // continue;
    //                 }
    //                 else{
    //                     userdata[i]["my_collects"]=false;
    //                     mycollects.push(false);
    //                     console.log("no")
    //                 }
    //             }
    //             _this.setData({
    //                 users: userdata,
    //                 my_likes:mylikes,
    //                 my_collects:mycollects
    //             })
    //             console.log("success", userdata,mycollects)
    //         },
    //         fail(res) {
    //             console.log("fail", res)
    //         }
    //     })
    // },

    itemChange(e) {
        //console.log(e);
        const { index } = e.detail;
        let tabs = this.data.tabs;
        tabs.forEach((v, i) => i === index ? v.isactive = true : v.isactive = false);
        this.setData({
            tabs
        })
        
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onHide: function() {
        this.data.tabs[0].isactive = false;
    },
    onLoad: function (options) {
      // 获取是否取得了身份信息
      this.setData({
        flag: app.globalData.haveFlag
      })
      
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse){
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
      
      /*
      let _this=this;
      wx.showActionSheet({
        itemList: _this.data.itemList,     
        success: function (res) {    
          if (!res.cancel) {    
            console.log(typeof res.tapIndex)//这里是点击了那个按钮的下标   
            _this.setData({
              mode:_this.data.itemList[res.tapIndex]
            })
          }
    
        }
    
      })*/
      //从其他页面返回本页面时获取参数
      if(this.data.open_ID!="")
      {
        if(this.data.flag==1)this.get_infoD();
        if(this.data.flag==2)this.get_infoP();
      }
      console.log('flag',this.data.flag);
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    chooseP: function(){
      app.globalData.haveFlag = 2; //2表示病人
      this.setData({
        ispatient: true,
        flag: 2
      })
      //第一次编译时获取参数
      this.get_infoP()
      console.log("userinfo:",app.globalData.open_ID)
    },

    chooseD: function(){
      app.globalData.haveFlag = 1; //1表示医生
      this.setData({
        ispatient: false,
        flag: 1
      })
      //第一次编译时获取参数
      this.get_infoD()
      console.log("userinfo:",app.globalData.open_ID)
    },
    transfer(e){
      
      console.log("e:",e.currentTarget.dataset.index);
      var index=e.currentTarget.dataset.index;
      app.globalData.look=this.data.user_detail.mydata[index];
      console.log("look:",app.globalData.look)
      wx.navigateTo({
        url: '/pages/detailA/detailA',
      })
    },
    //访问医生的数据库
    get_infoD(){
      var that=this;
      var user=app.globalData.open_ID;
      console.log('USER:',user);
     if(that.data.flag==1){
        DB1.where({
          openid: user
      }).get({
        success(res){
          that.setData({
            user_detail:res.data[0]
          })
        }
      })
      }
    },
    //访问病人的数据库
    get_infoP(){
      var that=this;
      var user=app.globalData.open_ID;
      console.log('USER:',user);
     if(that.data.flag==2){
        DB2.where({
          openid: user
      }).get({
        success(res){
          console.log('res',res);
          that.setData({
            user_detail:res.data[0]
          })
        }
      })
      }
    },
    checkCondition: function(){
      this.setData({
        toTabs: 1
      })
    },
    checkInfo: function(){
      this.setData({
        toTabs: 2
      })
    },
    //  点击tabbar跳转函数
    //  flag是参数 flag 1：医生；2： 病人
    goIndex: function(){
      wx.navigateTo({
        url: `../index/index?flag=${this.data.flag}`
      })
    },
    goList: function(){
      wx.redirectTo({
        url: `../catelog/catelog?flag=${this.data.flag}`
      })
    },
    goSearch: function(){
      wx.redirectTo({
        url: `../search/search?flag=${this.data.flag}`
      })
    },
    goCenter: function(){
      wx.navigateTo({
        url: `../login/login?flag=${this.data.flag}`
      })
    },
})