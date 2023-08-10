//index.js
//获取应用实例
var util = require('../../../utils/util.js');
const app = getApp()
const DB = wx.cloud.database().collection("IOT_Patient")
const db = wx.cloud.database()
//websocket心跳重连对象
let heartCheck = {
  timeout: 60000, //1s
  timeoutObj: null,
  serverTimeoutObj: null,
  //重置
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  //开始
  start: function () {
    wx.sendSocketMessage({
      data: "null",
    });
  },
};
//微信小程序新录音接口，录出来的是aac或者mp3，这里要录成mp3
const recorderManager = wx.getRecorderManager();
const options = {
  duration: 600000, //录音时长，这里设置的是最大值10分钟
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  //frameSize: 50 
};

//音频播放
const innerAudioContext = wx.createInnerAudioContext()


Page({

  data: {
    taskId: '',
    userId: '',
    chatList: [], //聊天内容
    isShowModelUp: false, //底部弹框显示true,隐藏为false 
    isLuYin: false, //没有录音false,开始录音true
    luYinText: '按住说话',
    audioUrl: '', //录音文件地址
    isShowLuYin: false, //true为开始播放，false为取消播放
    inputValue: '', //输入框内容
    lockReconnect: false, //默认进来是断开链接的
    limit: 0, //重连次数
    to: "oTvD95KyTP9kIUG6eIGrNI_GDVpQ",
    mine: "oTvD95GRhDLbf7pkJI-mcDCzWfTk"
  },
  getOpenID() {
    let app = getApp()

    return app.globalData.open_ID
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
  js_date_time_pic(unixtime) {
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
    // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//年月日时分秒
    return h + ':' + minute + ':' + second;
    // return y + '-' + m + '-' + d;
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
    // var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    // second = second < 10 ? ('0' + second) : second;
    // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//年月日时分秒
    return h + ':' + minute;
    // return y + '-' + m + '-' + d;
  },

  watchMessage() {
    let anOtherID = this.data.to
    // let myOpenID = this.getOpenID()
    let myOpenID = this.data.mine
    var that = this;
    db.collection('news').where(
        db.command.or([{
          from: myOpenID,
          to: anOtherID
        }, {
          from: anOtherID,
          to: myOpenID
        }])
      )
      .watch({
        onChange: function (snapshot) {
          let messageList = snapshot.docs
          // 拿到全部消息的数组
          if (messageList.length == that.data.chatList.length) return
          messageList.sort(that.compareFn)
          messageList[0].showTime = true
          for (let i = 0; i < messageList.length; i++) {
            // 修改显示的时间
            let time = messageList[i].time
            let date = new Date(time)
            time = date.getTime()
            messageList[i].time = that.js_date_time(time)
            // 判断显示在左边还是右边
            if (messageList[i]['from'] === myOpenID) messageList[i]['isAdmin'] = true
            else messageList[i]['isAdmin'] = false

            // 添加用户的头像 userImage 和 imgUrl
            let mine = wx.getStorageSync('userInfo')
            messageList[i].avatarUrl = mine.avatarUrl
            db.collection('users').where({
                open_ID: anOtherID
              }).get()
              .then(res => {
                let data = res.data[0]
                messageList[i].userImage = data.avatarUrl
                that.setData({
                  chatList: messageList
                })
                that.pageScrollToBottom()
              })
            // 事件显示与否
            if (i == 0) continue
            messageList[i].showTime = messageList[i].time - messageList[i - 1].time > 300000
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
  },
  onLoad: function (options) {
    console.log("options in chat.js of packageA", options)
    var id = options.id;
    this.watchMessage()
  },
  //打开底部弹框
  showModelUp: function () {
    var that = this;
    if (that.data.isShowModelUp == false) {
      that.setData({
        isShowModelUp: true,
      })
    } else {
      that.setData({
        isShowModelUp: false,
      })
    }
  },
  //关闭底部弹框
  closeModelUp: function () {
    var that = this;
    that.setData({
      isShowModelUp: false,
    })
  },
  //选择照片
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0];
        let time = that.js_date_time_pic(new Date())
        wx.cloud.uploadFile({
          cloudPath: 'chatImage/' + time + '.png', // 上传至云端的路径
          filePath: tempFilePath, // 小程序临时文件路径
          success: res => {
            var img_path = res.fileID;
            that.addMessageToNews("", img_path, "")
          },
          fail: () => {
            console.log(error)
          }
        })
        //关闭弹窗
        that.closeModelUp();
        that.pageScrollToBottom();
      }
    })
  },
  //界面滚到最底端
  pageScrollToBottom: function () {
    // wx.createSelectorQuery().select('#bottom').boundingClientRect(function (rect) {
    //   // console.log(rect.top);
    //   // console.log(rect.bottom);
    //   // 使页面滚动到底部
    //   wx.pageScrollTo({
    //     scrollTop: rect.bottom + 200
    //   })
    // }).exec()
  },
  //预览图片
  previewImage: function (e) {
    // console.log(e);
    var url = e.currentTarget.dataset.src;
    var that = this;
    wx.previewImage({
      current: url[0], // 当前显示图片的http链接
      urls: url // 需要预览的图片http链接列表
    })
  },
  //拍摄
  paishe: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(res);
        that.pushChatList(1, {
          imgUrl: tempFilePaths,
        })
        //关闭弹窗
        that.closeModelUp();
        that.pageScrollToBottom();
      }
    })
  },
  //发送位置
  getlocat: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            name: '时代一号',
            desc: '现在的位置'
          }],
        })
        that.pushChatList(1, {
          map: true
        })
      }
    })
    that.closeModelUp();
    that.pageScrollToBottom();
  },
  //切换是否录音按钮
  btnRecord: function () {
    var that = this;
    if (that.data.isLuYin == false) {
      that.setData({
        isLuYin: true
      });
    } else {
      that.setData({
        isLuYin: false,
        luYinText: '按住说话'
      });
    }
  },
  //开始录音
  startRecord: function (e) {
    var that = this;
    that.setData({
      luYinText: '录音中...',
    });
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    })
  },
  //结束录音
  stopRecord: function () {
    var that = this;
    that.setData({
      luYinText: '按住说话'
    });
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const {
        tempFilePath
      } = res;
      that.pushChatList(1, {
        audioUrl: tempFilePath,
        audioDuration: (res.duration / 60000).toFixed(2), //录音时长,转为分,向后取两位,
      })
      that.setData({
        audioUrl: tempFilePath,
        audioDuration: (res.duration / 60000).toFixed(2), //录音时长,转为分,向后取两位,
      })
      let time = that.js_date_time_pic(new Date())
      wx.cloud.uploadFile({
        cloudPath: 'chatAudio/' + time + '.mp3', // 上传至云端的路径
        filePath: tempFilePath, // 小程序临时文件路径
        success: res => {
          console.log("上传云端成功", res);
          var img_path = res.fileID;

          that.addMessageToNews("", "", img_path)
        },
        fail: () => {
          console.log(error)
        }
      })
    })
    //关闭弹窗
    that.closeModelUp();
    that.pageScrollToBottom();
  },
  //录音、停止播放
  playRecord: function (e) {
    console.log(e);
    var that = this;
    innerAudioContext.autoplay = true;
    innerAudioContext.src = that.data.audioUrl
    //innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46';//测试音频文件
    if (!e.currentTarget.dataset.isshowluyin) { //开始播放 
      //innerAudioContext.play();//兼容起见用它
      innerAudioContext.onPlay(() => {
        console.log('开始播放');
        that.setData({
          isShowLuYin: true
        });
        return;
      });
    } else { //暂停播放 
      innerAudioContext.pause();
      console.log("暂停");
      that.setData({
        isShowLuYin: false
      });
      return;
    }
  },
  getToday() {
    var date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month
    let day = date.getDate();
    let res = "_" + year + month + day
    let time = util.formatDateTime(util.getNowFormatDate())
    // console.log("time in chat.js", time)
    return time
  },
  updateLatestNews(newsId, userId, anotherId) {
    db.collection('latestNews').where(db.command.or([{
        userId: userId,
        anotherId: anotherId
      }, {
        userId: anotherId,
        anotherId: userId
      }])).get()
      .then(res => {
        let data = res.data
        if (data.length > 0) {
          db.collection('latestNews').where({
              userId,
              anotherId,
            })
            .update({
              data: {
                newsId
              }
            })
        } else {
          db.collection('latestNews').add({
            data: {
              userId,
              anotherId,
              newsId
            }
          })
        }
      })
  },
  addMessageToNews(text, imgUrl, audioUrl) {
    var that = this;
    let app = getApp()
    let from = this.data.mine
    let to = this.data.to
    db.collection('news').add({
        data: {
          from: from,
          to: to,
          time: new Date(),
          text: text,
          imgUrl,
          audioUrl
        }
      })
      .then(res => {
        that.setData({
          inputValue: '' //清空输入框
        })
        that.pageScrollToBottom();
        // 更新最新消息
        that.updateLatestNews(res._id, from, to)
      })
  },
  //输入框点击完成按钮时触发
  btnConfirm: function (e) {
    let text = e.detail.value
    this.addMessageToNews(text, "", "")
  },
  //页面隐藏/切入后台时触发
  onHide: function () {
    wx.onSocketClose(function (res) {
      console.log('WebSocket已关闭！')
    })
  },
  //页面卸载时触发
  onUnload: function () {
    var that = this;
    var id = that.data.userId;
    console.log("id:", id)
    DB.doc(id).update({
      data: {
        CHAT: that.data.chatList
      },
      success(res) {
        console.log("更新成功", res)
      },
      fail(res) {
        console.log("更新失败", res)
      }
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket已关闭！')
    })
  },
  //pushchatList
  //enu:0 是医生发送的消息
  //enu:1 是我发送的消息
  pushChatList: function (enu, options) {
    var that = this;
    var defaults = {
      userImage: '',
      text: '',
      isAdmin: false,
    }
    options = util.extendObj(defaults, options);
    options.time = util.formatDateTime(util.getNowFormatDate());
    // console.log(options);
    if (enu == 0) {
      options.userImage = '../images/admin.png';
      options.isAdmin = false;
    } else if (enu == 1) {
      options.userImage = app.globalData.wxUserInfo.avatarUrl;
      options.isAdmin = true;
    }
    var t = that.data.chatList;
    t.push(options)
    console.log("one message in before pushing chatList", t)
    that.setData({
      chatList: t
    });
  }

})