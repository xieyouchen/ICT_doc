//app.js
App({
    //应用第一次启动就会触发的事件
    onLaunch: function() {
        this.globalData.haveFlag = 0;
        //云开发初始化
        wx.cloud.init({
                env: 'cloud-rfgj8'
            })
            // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                // console.log(res);
                wx.cloud.callFunction({
                    name: "getopenid",
                    success: res => {
                        this.globalData.open_ID = res.result.openid;
                        console.log("success", res.result.openid)
                    },
                    fail(res) {
                        console.log("fail", res)
                    }
                })
            }
        })
        wx.cloud.callFunction({
                name: "getopenid",
                success: res => {
                    this.globalData.open_ID = res.result.openid;
                    console.log("success", res.result.openid)
                },
                fail(res) {
                    console.log("fail", res)
                }
            })
            // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {

                    // this.get_open_id();
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            this.globalData.userInfo["open_ID"] = this.globalData.open_ID
                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    
    get_open_id() {
        wx.cloud.callFunction({
            name: "getopenid",
            success(res) {
                console.log("success", res.result.openid)
            },
            fail(res) {
                console.log("fail", res)
            }
        })
    },
    //获取微信用户信息
    getWxUserInfo: function (callback) {
        var that = this;
        //获取微信用户信息
        wx.getUserInfo({
            success: function (res) {
                var data = JSON.parse(res.rawData);
                data.iv = res.iv;
                data.encryptedData = res.encryptedData;
                that.setwxUserInfo(data);
                console.log(that.globalData.wxUserInfo);
                if (typeof (callback) == "function") {
                    callback(res);
                }
            }
        })
    },
    //登陆ERP
    loginErp: function (callback) {
        var that = this;
        wx.login({
            success: function (res) {
                var code = res.code;
                console.log('loginErpCode:' + code);
                that.getWxUserInfo(function () {
                    wx.request({
                        url: that.globalData.apiHost + 'up/Supplier/Login?code=' + code + '&iv=' + that.globalData.wxUserInfo.iv + '&encryptedData=' + that.globalData.wxUserInfo.encryptedData,
                        method: 'GET',
                        success: function (res) {
                            //业务异常处理
                            if (res.statusCode == 250) {
                                wx.showToast({
                                    title: res.data,
                                    duration: 2000
                                })
                            }
                            else {
                                console.log("登录成功,返回数据：" + res.data);
                                that.setcurrentUserInfo(res.data.supplier);
                                that.globalData.accessToken = res.data.accessToken;
                                that.globalData.unionId = res.data.unionid;
                                that.globalData.isLoginErp = true;
                                
                                if (typeof (callback) == "function") {
                                    callback(res);
                                }
                            }
                        },
                        fail: function (res) {
                            console.log('fail:' + res.errMsg);
                        },
                        complete: function (res) {
                            console.log('complete:' + res.errMsg);
                        }
                    })
                })
            }
        })
    },
    //验证授权
    checkAuthorization: function (callback) {
        var that = this;
        //登陆过后则不需要再登陆
        if (that.globalData.isLoginErp) callback();
        //查看是否授权
        else if (wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              console.log('用户已经授权,登陆ERP获取unioid');
              console.log('iv:' + that.globalData.wxUserInfo.iv);
              console.log("data:" + that.globalData.wxUserInfo.encryptedData);         
              that.loginErp(callback);
            }
            else {
              console.log('用户未授权,转至授权页面');
              wx.reLaunch({
                url: './login'
              })
            }
          }
        }));
    },
    //退出登录
    logOut: function () {
        var that = this;
        that.globalData.id = 0;
        that.globalData.phone = "";
        that.globalData.name = "";
        that.globalData.status = null;
        that.globalData.publicOpenId = "";
        that.globalData.accessToken = null;
        that.globalData.unionId = null;
        that.globalData.isLoginErp=false;
        that.globalData.wxUserInfo = [];
        console.log('清除登陆信息！');
    }, 
    globalData: {
        look:{},
        data2:[],//[[1,2,3,4,5],[6,6,8,9,10]],//[],
        data_p:[],
        len:0,
        time_n:null,
        sysinfo: {},
        BluetoothState: false, // 蓝牙适配器状态
        connectState: false ,// 蓝牙连接状态
        userInfo: null,
        open_ID: "",
        id: 0,   //用户编号
        phone: "",   //用户手机 
        name: "", //用户名称
        status: null,  //用户状态 
        publicOpenId: "",  //用户服务号OpenId
        accessToken: null,  //应用签名
        unionId: null,  //登录标识 
        socketHost: "ws://localhost:60000",
        socketConnected: false,
        isLoginErp:false,
        wxUserInfo: [],   //微信用户信息 
        wsUrl: 'ws://localhost:8001',//websocket地址
        haveFlag: 0
    },
    onShow: function () {
        var that = this;
        //登陆授权 
        that.checkAuthorization(that.onLogin);
    },
 
    //保存用户信息
    setcurrentUserInfo: function (user) {
        var that = this;
        that.globalData.id = user.id;
        that.globalData.phone = user.phone;
        that.globalData.status = user.status;
        that.globalData.publicOpenId = user.publicOpenId;
        that.globalData.name = user.name;
    },

    //保存微信用户信息
    setwxUserInfo: function (user) {
        var that = this;
        that.globalData.wxUserInfo.avatarUrl = user.avatarUrl;  //头像
        that.globalData.wxUserInfo.city = user.city;  //城市
        that.globalData.wxUserInfo.country = user.country;  //国家
        that.globalData.wxUserInfo.gender = user.gender;  //性别 int类型
        that.globalData.wxUserInfo.language = user.language;  //语言
        that.globalData.wxUserInfo.nickName = user.nickName;  //昵称
        that.globalData.wxUserInfo.province = user.province;  //省
        that.globalData.wxUserInfo.encryptedData = user.encryptedData;  //使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息
        that.globalData.wxUserInfo.iv = user.iv;  // 加密算法的初始向量
    },
    getModel: function () { //获取手机型号
        return this.globalData.sysinfo["model"]
      },
      getVersion: function () { //获取微信版本号
        return this.globalData.sysinfo["version"]
      },
      getSystem: function () { //获取操作系统版本
        return this.globalData.sysinfo["system"]
      },
      getPlatform: function () { //获取客户端平台
        return this.globalData.sysinfo["platform"]
      },
      getSDKVersion: function () { //获取客户端基础库版本
        return this.globalData.sysinfo["SDKVersion"]
      },
      buf2string: function (buffer) {
        var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
        var str = ''
        for (var i = 0; i<arr.length; i++) {
        str += String.fromCharCode(arr[i])
      }
      return str
      },
      buf2hex: function (buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
      },
      string2buf: function (str) {
        // 首先将字符串转为16进制
        let val = ""
        for (let i = 0; i < str.length; i++) {
          if (val === '') {
            val = str.charCodeAt(i).toString(16)
          } else {
            val += ',' + str.charCodeAt(i).toString(16)
          }
        }
        // 将16进制转化为ArrayBuffer
        return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
          return parseInt(h, 16)
        })).buffer
      },
      /**
       * 字符串每20个字节分包返回数组
       */
      subPackage: function (str) {
        const packageArray = []
        for (let i = 0; str.length > i; i += 20) {
          packageArray.push(str.substr(i, 20))
        }
        return packageArray
      },
      /**
       * 停止搜索附近蓝牙
       */
      stopSearchDevs: function () {
        wx.stopBluetoothDevicesDiscovery({
          success: function (res) { },
        })
      },
      /**
       * 开始连接
       */
      startConnect(deviceId, deviceName = '未知设备') {
        if (this.globalData.BluetoothState) {
          wx.createBLEConnection({
            deviceId: deviceId,
            timeout: 10000, // 10s连接超时
            success: function (res) {
              
              wx.navigateTo({
                url: `/pages/service/service?deviceId=${deviceId}&deviceName=${deviceName}`,
              })
            },
          })
        }
      },
      /**
       * 断开连接
       */
      endConnect(deviceId) {
        if (this.globalData.BluetoothState) {
          wx.closeBLEConnection({
            deviceId: deviceId,
            success: function (res) {},
          })
        }
      }
    ,
    onShow: function () {
        var that = this;
        //登陆授权 
        that.checkAuthorization(that.onLogin);
    },
 
    //保存用户信息
    setcurrentUserInfo: function (user) {
        var that = this;
        that.globalData.id = user.id;
        that.globalData.phone = user.phone;
        that.globalData.status = user.status;
        that.globalData.publicOpenId = user.publicOpenId;
        that.globalData.name = user.name;
    },

    //保存微信用户信息
    setwxUserInfo: function (user) {
        var that = this;
        that.globalData.wxUserInfo.avatarUrl = user.avatarUrl;  //头像
        that.globalData.wxUserInfo.city = user.city;  //城市
        that.globalData.wxUserInfo.country = user.country;  //国家
        that.globalData.wxUserInfo.gender = user.gender;  //性别 int类型
        that.globalData.wxUserInfo.language = user.language;  //语言
        that.globalData.wxUserInfo.nickName = user.nickName;  //昵称
        that.globalData.wxUserInfo.province = user.province;  //省
        that.globalData.wxUserInfo.encryptedData = user.encryptedData;  //使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息
        that.globalData.wxUserInfo.iv = user.iv;  // 加密算法的初始向量
    },
    

})