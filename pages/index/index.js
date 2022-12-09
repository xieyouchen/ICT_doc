//index.js
//获取应用实例
const app = getApp()
const DB = wx.cloud.database().collection("IOT_Patient")
Page({
  data: {
    // 蓝牙模块数据
    devs: [],
    motto: 'Hello World！',
    userInfo: {},
    mode: -1,
    itemList: ['病人', '医生'],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    patientlist: [],
    floor: [{
        id: 0,
        name: "早间数据",
        contain: [{
            id_sec: 0,
            name_sec: "2020-12-10 09:34",
            Active: false
          }

        ]
      },
      {
        id: 1,
        name: "晚间数据",
        contain: [{
            id_sec: 0,
            name_sec: "2020-12-10 19:23",
            Active: false
          }

        ]
      }
    ],

    tabs: [{
        id: 0,
        name: "病人消息",
        isactive: true
      },
      {
        id: 1,
        name: "最新监测",
        isactive: false
      }
    ],
    tabs2: [{
        id: 0,
        name: "蓝牙连接",
        isactive: true
      }
      // ,
      // {
      //     id: 1,
      //     name: "数据获取",
      //     isactive: false
      // }
    ],
    theflag: app.globalData.haveFlag
  },
  // 蓝牙模块自定义数据
  customData: {
    _devs: []
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
  // c_itemChange(e) {
  //     // console.log(e);
  //     const { index } = e.detail;
  //     let cates1 = this.data.cates1;
  //     cates1.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
  //     this.setData({
  //             cates1
  //         })
  //         // cates1.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
  //     const target = '';
  //     switch (index) {
  //         case 0:
  //             //console.log(index);
  //             wx.navigateTo({
  //                 url: '../math/math',
  //                 success: function(res) {
  //                     console.log("success0");
  //                 },
  //                 fail: function() {
  //                     // fail
  //                 },
  //                 complete: function() {
  //                     // complete
  //                 }
  //             });
  //             break;

  //         case 1:
  //             //console.log(index);
  //             wx.navigateTo({
  //                 url: '../physics/physics',
  //                 success: function(res) {
  //                     console.log("success1");
  //                 },
  //                 fail: function() {
  //                     // fail
  //                 },
  //                 complete: function() {
  //                     // complete
  //                 }
  //             })
  //             break;
  //         case 2:
  //             //console.log(index);
  //             wx.navigateTo({
  //                 url: '../english/english',
  //                 success: function(res) {
  //                     console.log("success2");
  //                 },
  //                 fail: function() {
  //                     // fail
  //                 },
  //                 complete: function() {
  //                     // complete
  //                 }
  //             })
  //             break;
  //         case 3:
  //             //console.log(index);
  //             wx.navigateTo({
  //                 url: '../cs/cs',
  //                 success: function(res) {
  //                     console.log("success3");
  //                 },
  //                 fail: function() {
  //                     // fail
  //                 },
  //                 complete: function() {
  //                     // complete
  //                 }
  //             })
  //             break;
  //         case 4:
  //             //console.log(index);
  //             wx.navigateTo({
  //                 url: '../others/others',
  //                 success: function(res) {
  //                     console.log("success4");
  //                 },
  //                 fail: function() {
  //                     // fail
  //                 },
  //                 complete: function() {
  //                     // complete
  //                 }
  //             })
  //             break;
  //     }
  // },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  get_data() {
    var that = this;
    DB.get({
      success(res) {
        console.log("查询成功", res.data);
        that.setData({
          patientlist: res.data
        })
      },
      fail(res) {
        console.log("查询失败", res)
      }
    })
  },
  onLoad: function (options) {
    // 获取当前用户是医生还是病人的信息,1：医生，2：病人
    var f = app.globalData.haveFlag; //options.flag - 0;
    if (f == 2) {
      this.setData({
        tabs: [{
          id: 0,
          name: "蓝牙连接",
          isactive: true
        }]

        // ['tabs[0].name']:'蓝牙连接',
        // ['tabs[1].name']:'数据获取'
      })
    }
    this.setData({
      theflag: f
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
    if (app.getPlatform() == 'android' && this.versionCompare('6.5.7', app.getVersion())) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请更新至最新版本',
        showCancel: false
      })
    } else if (app.getPlatform() == 'ios' && this.versionCompare('6.5.6', app.getVersion())) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请更新至最新版本',
        showCancel: false
      })
    }

    /**
     * 微信蓝牙模块初始化
     */
    const self = this
    wx.openBluetoothAdapter({
      success: function (res) {
        // console.log('search.js[onLoad]: openBluetoothAdapter success')
        app.globalData.BluetoothState = true
        self.startSearchDevs() // 搜索附近蓝牙
      },
      fail: function (err) {
        // console.log('search.js[onLoad]: openBluetoothAdapter fail')
        if (err.errCode === 10001) { // 手机蓝牙未开启
          app.globalData.BluetoothState = false
          wx.showLoading({
            title: '请开启手机蓝牙',
          })
        } else {
          console.log(err.errMsg)
        }
      }
    })
    /**
     * 监听蓝牙适配器状态变化
     */
    wx.onBluetoothAdapterStateChange(function (res) {
      // console.log('search.js[onLoad]: onBluetoothAdapterStateChange')
      if (res.available) {
        // console.log('search.js[onLoad]: BluetoothState is true')
        app.globalData.BluetoothState = true
        wx.openBluetoothAdapter({
          success: function (res) {
            app.globalData.BluetoothState = true
            wx.hideLoading()
          },
        })
      } else {
        // console.log('search.js[onLoad]: BluetoothState is false')
        app.globalData.BluetoothState = false
        app.globalData.connectState = false
        wx.showLoading({
          title: '请开启手机蓝牙',
        })
      }
    })
    /**
     * 监听BLE蓝牙连接状态变化
     */
    wx.onBLEConnectionStateChange(function (res) {
      if (res.connected) {
        // console.log('connected')
        wx.hideLoading()
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          success: function (res) {
            app.globalData.connectState = true
          }
        })
      } else {
        // console.log('disconnect')
        wx.hideLoading()
        wx.showToast({
          title: '已断开连接',
          icon: 'none',
          success: function (res) {
            app.globalData.connectState = false
          }
        })
      }
    })
    // patientList
    let patientlist = [{
      img: '../../icon/tab41.png',
        _id: 123,
        // 这里的_id 用来传递参数作用
        name: 'dy',
        content: 'Hello World!'
      },
      {
        img: '../../icon/tab41.png',
        _id: 124,
        name: 'lyx',
        content: '赶紧加班!'
      }
    ]
    this.setData({
      patientlist
    })
  },
  onShow: function () {
    this.get_data({
      theflag: app.globalData.haveFlag
    });
  },
  onHide: function () {
    app.stopSearchDevs()
  },
  onPullDownRefresh: function () {
    if (app.globalData.BluetoothState) {
      const self = this
      this.customData._devs = []
      wx.closeBluetoothAdapter({
        success: function (res) {
          wx.openBluetoothAdapter({
            success: function (res) {
              self.startSearchDevs()
            }
          })
        }
      })
    }
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 2000)
  },
  startSearchDevs: function () {
    const self = this
    wx.startBluetoothDevicesDiscovery({ // 开启搜索
      allowDuplicatesKey: false,
      success: function (res) {
        wx.onBluetoothDeviceFound(function (devices) {
          var isExist = false
          if (devices.deviceId) {
            for (let item of self.customData._devs) {
              if (item.deviceId === devices.deviceId) {
                isExist = true
                break;
              }
            }!isExist && self.customData._devs.push(devices)
            self.setData({
              devs: self.customData._devs
            })
          } else if (devices.devices) {
            for (let item of self.customData._devs) {
              if (item.deviceId === devices.devices[0].deviceId) {
                isExist = true
                break;
              }
            }!isExist && self.customData._devs.push(devices.devices[0])
            self.setData({
              devs: self.customData._devs
            })
          } else if (devices[0]) {
            for (let item of self.customData._devs) {
              if (item.deviceId === devices[0].deviceId) {
                isExist = true
                break;
              }
            }!isExist && self.customData._devs.push(devices[0])
            self.setData({
              devs: self.customData._devs
            })
          }
        })
      }
    })
  },
  versionCompare: function (ver1, ver2) {
    var version1pre = parseFloat(ver1)
    var version2pre = parseFloat(ver2)
    var version1next = parseInt(ver1.replace(version1pre + ".", ""))
    var version2next = parseInt(ver2.replace(version2pre + ".", ""))
    if (version1pre > version2pre)
      return true
    else if (version1pre < version2pre)
      return false
    else {
      if (version1next > version2next)
        return true
      else
        return false
    }
  },
  connect(event) {
    if (app.globalData.BluetoothState) {
      const deviceId = event.currentTarget.dataset.dev.deviceId
      const deviceName = event.currentTarget.dataset.dev.name
      wx.showLoading({
        title: '正在连接...',
      })
      app.startConnect(deviceId, deviceName)
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //  点击tabbar跳转函数
  //  flag是参数 flag 1：医生；2： 病人
  goCenter: function () {
    wx.redirectTo({
      url: `../login/login?flag=${this.data.flag}`
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
  }
})