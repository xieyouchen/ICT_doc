//index.js
//获取应用实例
const app = getApp()
let db = wx.cloud.database()
const DB1 = wx.cloud.database().collection("IOT_Doctor")
const DB2 = wx.cloud.database().collection("IOT_Patient")
let mynote = []
let userdata = [];
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    nickNameDisabled: false,
    submit: false,
    nickName: "请输入昵称",
    avatarUrl: defaultAvatarUrl,
    doctor: {
      img: '../../icon/doc.jpg',
      name: 'xyc',
      registerTime: '2022-11-18'
    },
    users: [],
    mode: -1,
    //    itemList:['病人', '医生'],
    //用户的openid
    user: null,
    //用户的个人信息
    user_detail: {
      mydata: []
    },
    index: null,
    defaultimg: "/icon/LOGO.jpg",
    my_likes: [],
    my_collects: [],
    current_index: null,
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

  itemChange(e) {
    //console.log(e);
    const {
      index
    } = e.detail;
    let tabs = this.data.tabs;
    tabs.forEach((v, i) => i === index ? v.isactive = true : v.isactive = false);
    this.setData({
      tabs
    })

  },
  onHide: function () {
    this.data.tabs[0].isactive = false;
  },
  compareFn(a, b) {
    if (a.time < b.time) {
      return -1;
    }
    if (a.time > b.time) {
      return 1;
    }
    // a 一定等于 b
    return 0;
  },
  getAllData() {
    let that = this
    let id = wx.getStorageSync('open_ID')
    db.collection('dataOneDay').where({
        patientId: id
      }).get()
      .then(res => {
        // console.log("res of all data in login.js", res)
        let data = res.data
        data.sort(that.compareFn)
        // console.log("res of all data after sorting in login.js", data)
        that.setData({
          dataAll: data
        })

        // 获得 img_time 的数据
        let img_time = []
        for (let i = data.length - 1; i >= 0; i--) {
          let time = that.getTimeSplice(data[i].time)
          img_time.push({
            img: data[i].img,
            year: time['year'],
            month: time['month'],
            day: time['day']
          })
        }
        that.setData({
          img_time: img_time
        })
      })
  },
  getTimeSplice(time) {
    let res = {
      year: time.slice(1, 5),
      month: time.slice(5, 7),
      day: time.slice(7)
    }
    return res
  },
  addLastNum(data) {
    data['morning'].push(data['morning'][5])
    data['noon'].push(data['noon'][5])
    data['night'].push(data['night'][5])

    return data
  },
  getDataOneDay(index) {
    let data = this.data.dataAll[index]
    data = this.addLastNum(data)
    console.log("data after addLastNum()", data)
    let time = this.getTimeSplice(data['time'])
    let dataToday = {
      today: [{
          img: data['img'],
          data: data['morning'],
          tag: '早'
        },
        {
          data: data['noon'],
          tag: '中'
        },
        {
          data: data['night'],
          tag: '晚'
        }
      ],
      year: time['year'],
      month: time['month'],
      day: time['day']
    }
    return dataToday
  },
  onLoad: function (options) {
    let app = getApp()
    this.chooseP()
    // 获取该病人的每天数据，按照时间顺序从前往后
    setInterval(this.getAllData, 3000)
    // this.getAllData()
    this.setData({
      flag: app.globalData.haveFlag,
    })
    let user = wx.getStorageSync('userInfo')
    if (user) {
      console.log(user)
      this.setData({
        userInfo: user,
        hasUserInfo: true,
        submit: true,
        nickNameDisabled: true
      })
      this.setData({
        avatarUrl: user.avatarUrl,
        nickName: user.nickName
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      // app.userInfoReadyCallback = res => {
      //   this.setData({
      //     userInfo: res.userInfo,
      //     hasUserInfo: true
      //   })
      // }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      // wx.getUserInfo({
      //   success: res => {
      //     app.globalData.userInfo = res.userInfo
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //   }
      // })
    }
    //从其他页面返回本页面时获取参数
    if (this.data.open_ID != "") {
      if (this.data.flag == 1) this.get_infoD();
      if (this.data.flag == 2) this.get_infoP();
    }
    // console.log('flag',this.data.flag);

  },
  storeUser() {
    let id = wx.getStorageSync('open_ID')
    let userInfo = {
      nickName: this.data.nickName,
      avatarUrl: this.data.avatarUrl,
      open_ID: id
    }
    app.globalData.userInfo = userInfo
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
    wx.setStorageSync('userInfo', userInfo)

    // 存入数据库
    db.collection('users').add({
      data: {
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        open_ID: userInfo.open_ID
      }
    })
  },

  nickNameInput(e) {
    console.log(e)
    // 不知道为什么，本地调试中返回的 nickName 在 e.detail.value.nickName，而真机调试在 e.detail.value
    let nickName = e.detail.value.nickName? e.detail.value.nickName : e.detail.value
    console.log("nickName in nickNameInput()", nickName)
    this.setData({
      nickName,
      submit: true
    })
    this.storeUser()
  },
  js_date_time(unixtime) {
    var date = new Date(unixtime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//年月日时分秒
    // return h + ':' + minute;
    // return y + '-' + m + '-' + d;
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    // 将 avatar 存入云存储
    let date = new Date()
    let time = date.getTime()
    time = this.js_date_time(time)  
    console.log("time", time)
    wx.cloud.uploadFile({
      cloudPath: 'avatarUrl/' + time + '.png', // 上传至云端的路径
      filePath: avatarUrl, // 小程序临时文件路径
      success: res => {
        console.log("上传云端成功", res);
        let avatarUrl = res.fileID;
        this.setData({
          avatarUrl,
          hasUserInfo: true
        })
      },
      fail: () => {
        console.log(error)
      }
    })
  },
  chooseP: function () {
    app.globalData.haveFlag = 2; //2表示病人
    this.setData({
      ispatient: true,
      flag: 2
    })
    //第一次编译时获取参数
    this.get_infoP()
    // console.log("userinfo:",app.globalData.open_ID)
  },

  chooseD: function () {
    app.globalData.haveFlag = 1; //1表示医生
    this.setData({
      ispatient: false,
      flag: 1
    })
    //第一次编译时获取参数
    this.get_infoD()
    console.log("userinfo:", app.globalData.open_ID)
  },
  transfer(e) {
    var index = e.currentTarget.dataset.index;
    let data = this.getDataOneDay(index)
    console.log("data in transfer() of login.js", data)
    app.globalData.look = data
    console.log("look:", app.globalData.look)
    wx.navigateTo({
      url: '/pages/detailA/detailA',
    })
  },
  //访问医生的数据库
  get_infoD() {
    var that = this;
    var user = app.globalData.open_ID;
    console.log('USER:', user);
    if (that.data.flag == 1) {
      DB1.where({
        openid: user
      }).get({
        success(res) {
          that.setData({
            user_detail: res.data[0]
          })
        }
      })
    }
  },
  //访问病人的数据库
  get_infoP() {
    var that = this;
    var user = app.globalData.open_ID;
    // console.log('USER:',user);
    if (that.data.flag == 2) {
      DB2.where({
        openid: user
      }).get({
        success(res) {
          console.log('res', res);
          that.setData({
            user_detail: res.data[0]
          })
        }
      })
    }
  },
  checkCondition: function () {
    this.setData({
      toTabs: 1
    })
  },
  checkInfo: function () {
    this.setData({
      toTabs: 2
    })
  },
  //  点击tabbar跳转函数
  //  flag是参数 flag 1：医生；2： 病人
  goIndex: function () {
    wx.navigateTo({
      url: `../index/index?flag=${this.data.flag}`
    })
  },
  goList: function () {
    wx.redirectTo({
      url: `../catelog/catelog?flag=${this.data.flag}`
    })
  },
  goSearch: function () {
    wx.redirectTo({
      url: `../search/search?flag=${this.data.flag}`
    })
  },
  goCenter: function () {
    wx.navigateTo({
      url: `../login/login?flag=${this.data.flag}`
    })
  },
})