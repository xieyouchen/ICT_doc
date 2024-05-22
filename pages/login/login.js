//index.js
//获取应用实例
const app = getApp()
let db = wx.cloud.database()
let mynote = []
let userdata = [];
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    nickNameDisabled: false,
    submit: false,
    nickName: "请输入昵称",
    avatarUrl: defaultAvatarUrl,
    users: [],
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
      return 1;
    }
    if (a.time > b.time) {
      return -1;
    }
    // a 一定等于 b
    return 0;
  },
  watchAllData() {
    let that = this
    let id = wx.getStorageSync('open_ID')
    db.collection('dataOneDay').where({
        patientId: id
      })
      .watch({
        onChange: function (snapshot) {
          console.log('snapshot', snapshot)
          let data = snapshot.docs
          data.sort(that.compareFn)
          // console.log("res of all data after sorting in login.js", data)
          // 获得 img_time 的数据
          let img_time = []
          that.setData({
            dataAll: data,
            img_time
          })
          for (let i = 0; i <= data.length - 1; i++) {
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
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
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
    // data = this.addLastNum(data)
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
    this.watchAllData()
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
    }

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
    this.watchAllData()
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
    let nickName = e.detail.value.nickName ? e.detail.value.nickName : e.detail.value
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
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second; //年月日时分秒
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
    let imgSum = this.data.dataAll[index].imgSum
    // img 通过 app.globalData.look 传递
    wx.navigateTo({
      url: '/pages/detailA/detailA?imgSum=' + imgSum,
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