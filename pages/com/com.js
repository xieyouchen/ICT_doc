const app = getApp()
var util = require('../../utils/util.js')
const db = wx.cloud.database()
const DB2 = wx.cloud.database().collection("IOT_Patient")
import * as echarts from '../../ec-canvas/echarts';
let len = app.globalData.len;
let myseries_Sum = [];
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  let len = app.globalData.len;
  // var A=[app.globalData.data2[len-1],app.globalData.data2[len-1]];//data1;
  var A = app.globalData.data_p
  //var B=data2;
  console.log("A:", A)
  // self.Debug("app.globleData in com.js", app.globalData)
  var title = String(app.globalData.time_n.year) + "-" + String(app.globalData.time_n.month) + "-" + String(app.globalData.time_n.day) + ":" + String(app.globalData.time_n.hour) + ":" + String(app.globalData.time_n.minutes);
  var choose = 0;
  if (app.globalData.time_n.hour > 12) choose = 1;

  var option = {
    title: {
      text: title,
      left: 'center'
    },
    color: ["#37A2DA", "#67E0E3"],
    legend: {
      data: [
        ['早上'],
        ['晚上']
      ][choose],
      top: 'auto',
      left: 'right',

      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      name: "时间",
      type: 'category',
      boundaryGap: false,
      data: ['0', '第0.2s', '第0.4s', '第0.6s', '第0.8s', '第1.0s'],
      // show: false
    },
    yAxis: {
      name: "呼气流量值",
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
        name: '早上',
        type: 'line',
        smooth: true,
        data: A[0] //[18, 36, 65, 30, 78, 40, 33]
      }, {
        name: '中午',
        type: 'line',
        smooth: true,
        data: A[1] // [12, 50, 51, 35, 70, 30, 20]
      }, {
        name: '晚上',
        type: 'line',
        smooth: true,
        data: A[2] // [12, 50, 51, 35, 70, 30, 20]
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

function parseA(A) {
  let tag = ['早', '中', '晚']
  let res = []
  for(let i = 0 ; i < A.length ; i++) {
    A[i].push(0)
    res.push({
      tag: tag[i],
      data: A[i]
    })
  }
  return res
}

function initChartSum(canvas, width, height, dpr) {
  var A = app.globalData.data_p
  //var B=data2;
  console.log("A in initChartSum()", A)
  const today = parseA(A)
  console.log("today in initChartSum()", today)
  const mylengend = [];
  const color_list = ["#37A2DA", "#67E0E3", "#9FE6B8"];
  const mycolor = [];
  myseries_Sum = []
  if (today != null)
  // 早中晚，最多3 = today.length
    for (var i = 0; i < today.length; i++) {
      var tmp = {};
      tmp["name"] = today[i].tag;
      tmp["type"] = 'line';
      tmp["smooth"] = true;
      let data_sum = [0]
      let dataTmp = today[i].data
      for (let i = 2; i < dataTmp.length; i++) {
        let num = dataTmp[i] - dataTmp[i - 1]
        num = parseInt(num / 0.045 * 15)
        data_sum.push(num)
      }
      tmp["data"] = data_sum;
      myseries_Sum.push(tmp);
      mylengend.push(today[i].tag);
      mycolor.push(color_list[i])
    }
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var option = {
    color: mycolor,
    legend: {
      data: mylengend,
      top: 'auto',
      left: 'right',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      name: "时间(s)",
      type: 'category',
      boundaryGap: false,
      nameLocation: 'end',
      nameTextStyle: {
        padding: [-20, 20, 0, -20]
      },
      data: ['0', '第0.2s', '第0.4s', '第0.6s', '第0.8s', '第1.0s'],
      // show: false
    },
    yAxis: {
      name: "呼气流量值(L/min)",
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: myseries_Sum
  };

  chart.setOption(option);
  return chart;
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hiddenall: true,
    img_path: null,
    flag: 0,
    f1: 0,
    f2: 0,
    index: 0,
    user_data: {},
    dnew: 1,
    receiverText: '',
    receiverLength: 0,
    sendText: '',
    sendLength: 0,
    time: 1000,
    timeSend: false,
    ec: {
      onInit: initChart
    },
    ecSum: {
      onInit: initChartSum
    }
  },
  /**
   * 自定义数据
   */

  customData: {
    sendText: '',
    deviceId: '',
    serviceId: '',
    characteristicId: '',
    canWrite: false,
    canRead: false,
    canNotify: false,
    canIndicate: false,
    time: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("app.globalData", app.globalData)
    this.setData({
      data1: app.globalData.data_p
    })
    this.setData({
      flag: app.globalData.haveFlag
    })
    const self = this
    var user = app.globalData.open_ID;
    console.log('USER:', user);
    if (self.data.flag == 2) {
      DB2.where({
        openid: user
      }).get({
        success(res) {
          console.log('res', res);
          var user_data = res.data[0],
            today = {},
            dnew = 1;
          var t = {},
            f1 = 0,
            f2 = 0,
            index = -1;
          if (!user_data.hasOwnProperty("mydata")) {
            user_data["mydata"] = [];
            today = {};
            dnew = 0;
            console.log("dnew:", dnew)
          } else {
            var date = new Date();
            t["year"] = date.getFullYear();
            t["month"] = date.getMonth() + 1;
            t["day"] = date.getDate();
            //f1=1,表示当天已测量过，f2表示测量的次数
            for (var i = 0; i < user_data.mydata.length; i++) {
              if (user_data.mydata[i].year == t.year && user_data.mydata[i].month == t.month && user_data.mydata[i].day == t.day) {
                f1 = 1;
                index = i;
                if (user_data.mydata[i].today.length == 1) f2 = 1;
                else if (user_data.mydata[i].today.length == 2) f2 = 2;
              }
            }

          }
          self.setData({
            user_data: user_data,
            f1: f1,
            f2: f2,
            index: index,
            dnew: dnew
          })
        }
      })
    }
    this.customData.deviceId = options.deviceId
    this.customData.serviceId = options.serviceId
    this.customData.characteristicId = options.characteristicId
    this.customData.canWrite = options.write === 'true' ? true : false
    this.customData.canRead = options.read === 'true' ? true : false
    this.customData.canNotify = options.notify === 'true' ? true : false
    this.customData.canIndicate = options.indicate === 'true' ? true : false
    /**
     * 如果支持notify
     */
    if (options.notify) {
      wx.notifyBLECharacteristicValueChange({
        deviceId: options.deviceId,
        serviceId: options.serviceId,
        characteristicId: options.characteristicId,
        state: true,
        success: function (res) {
          // do something...
        }
      })
    }
  },

  Debug(name, content) {
    console.log(name)
    console.log(content)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const self = this;

    function buf2string(buffer) {
      var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
      return arr.map((char, i) => {
        return String.fromCharCode(char);
      }).join('');
    }

    /**
     * 监听蓝牙设备的特征值变化
     */
    wx.onBLECharacteristicValueChange(function (res) {
      self.Debug("监听蓝牙设备的特征值变化", res)
      const receiverText = buf2string(res.value);
      console.log("res:", res)
      app.globalData.data2 = receiverText;
      self.setData({
        receiverLength: self.data.receiverLength + receiverText.length
      })
      setTimeout(() => {
        self.setData({
          receiverText: (self.data.receiverText + receiverText).substr(-4000, 4000)
        })
      }, 200)
      var result = app.globalData.data2.split("\n\n")
      var tmp = [],
        rest = [];
      for (var i = 0; i < result.length; i++) {
        if (result[i] != "") {
          tmp = result[i].split(" ");
        }
      }
      for (var i = 0; i < tmp.length; i++) {
        rest.push(Number(tmp[i]));
      }
      console.log("receive:", self.data.receiverText)
      console.log("data2:", app.globalData.data2)
      console.log("rest:", rest)
      data1[0] = rest;
      data1[1] = rest;
      app.globalData.data2 = rest;
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      receiverText: '',
      receiverLength: 0,
      sendText: '',
      sendLength: 0,
      time: 1000,
      timeSend: false
    })
  },
  /**
   * 更新发送框内容
   */
  updateSendText: function (event) {
    const value = event.detail.value
    this.customData.sendText = value
    this.setData({
      sendText: value
    })
  },
  /**
   * 更新定时发送时间间隔
   */
  updateTime: function (event) {
    const self = this
    const value = event.detail.value
    this.setData({
      time: /^[1-9]+.?[0-9]*$/.test(value) ? +value : 1000
    })
    clearInterval(this.customData.time)
    const deviceId = this.customData.deviceId // 设备ID
    const serviceId = this.customData.serviceId // 服务ID
    const characteristicId = this.customData.characteristicId // 特征值ID
    this.customData.time = setInterval(() => {
      const sendText = self.customData.sendText
      const sendPackage = app.subPackage(sendText) // 数据分每20个字节一个数据包数组
      if (app.globalData.connectState) {
        if (self.customData.canWrite) { // 可写
          self.writeData({
            deviceId,
            serviceId,
            characteristicId,
            sendPackage
          })
        }
      }
    }, self.data.time)
  },
  /**
   * 清除接收
   */
  clearReceiverText: function (event) {
    // this.customData.receiverText = ''
    this.setData({
      receiverText: '',
      receiverLength: 0,
      sendLength: 0
    })
  },
  /**
   * 清除发送
   */
  clearSendText: function (event) {
    this.customData.sendText = ''
    this.setData({
      sendText: '',
      sendLength: 0
    })
  },
  /**
   * 手动发送
   */
  manualSend: function (event) {
    const deviceId = this.customData.deviceId // 设备ID
    const serviceId = this.customData.serviceId // 服务ID
    const characteristicId = this.customData.characteristicId // 特征值ID
    const sendText = this.customData.sendText
    const sendPackage = app.subPackage(sendText) // 数据分每20个字节一个数据包数组
    if (app.globalData.connectState) {
      if (this.customData.canWrite) { // 可写
        this.writeData({
          deviceId,
          serviceId,
          characteristicId,
          sendPackage
        })
      }
    } else {
      wx.showToast({
        title: '已断开连接',
        icon: 'none'
      })
    }
  },
  /**
   * 自动发送
   */
  timeChange(event) {
    this.setData({
      timeSend: event.detail.value.length ? true : false
    })
    if (!this.data.timeSend) {
      clearInterval(this.customData.time)
    } else {
      const self = this
      const deviceId = this.customData.deviceId // 设备ID
      const serviceId = this.customData.serviceId // 服务ID
      const characteristicId = this.customData.characteristicId // 特征值ID
      this.customData.time = setInterval(() => {
        const sendText = self.customData.sendText
        const sendPackage = app.subPackage(sendText) // 数据分每20个字节一个数据包数组
        if (app.globalData.connectState) {
          if (self.customData.canWrite) { // 可写
            self.writeData({
              deviceId,
              serviceId,
              characteristicId,
              sendPackage
            })
          }
        }
      }, self.data.time)
    }
  },
  /**
   * 向特征值写数据(write)
   */
  writeData: function ({
    deviceId,
    serviceId,
    characteristicId,
    sendPackage,
    index = 0
  }) {
    const self = this
    let i = index;
    let len = sendPackage.length;
    if (len && len > i) {
      wx.writeBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        value: app.string2buf(sendPackage[i]),
        success: function (res) {
          self.setData({
            sendLength: self.data.sendLength + sendPackage[i].length // 更新已发送字节数
          })
          i += 1;
          self.writeData({
            deviceId,
            serviceId,
            characteristicId,
            sendPackage,
            index: i
          }) // 发送成功，发送下一个数据包
        },
        fail: function (res) {
          self.writeData({
            deviceId,
            serviceId,
            characteristicId,
            sendPackage,
            index
          }) // 发送失败，重新发送
        }
      })
    }
  },
  down(dom, SumFlag) {
    var that = this;
    // 这应该就是找到 echart 图标的 wxml 节点
    const ecComponent = that.selectComponent(dom);
    console.log("ecC:", ecComponent)
    // 先保存图片到临时的本地文件，然后存入系统相册，canvas->图片路径
    ecComponent.canvasToTempFilePath({
      success(res) {
        console.log("云端上传开始");
        console.log("tempFilePath:", res.tempFilePath)
        var tempFilePath = res.tempFilePath;
        var year = app.globalData.time_n.year;
        var month = app.globalData.time_n.month;
        var day = app.globalData.time_n.day;
        var hour = app.globalData.time_n.hour;
        var time = '_' + year + month + day;
        console.log("time:", time)
        let cloudPathTmp = 'dataOneDay/' + time + '.png'
        if(SumFlag) cloudPathTmp = 'dataOneDaySum/' + time + '.png'
        wx.cloud.uploadFile({
          cloudPath: cloudPathTmp, // 上传至云端的路径
          filePath: tempFilePath, // 小程序临时文件路径
          success: res => {
            console.log("上传云端成功", res);
            var img_path = res.fileID;
            if(SumFlag) {
              that.setData({
                imgSum_path: img_path,
                hiddenall: true
              })
            }
            else {
              that.setData({
                img_path: img_path,
                hiddenall: true
              })
            }

            // 上传数据到数据库
            that.uploadToDB()
            // that.get_infoP();
          },
          fail: () => {
            console.log(error)
          }
        })
      },
      fail(res) {
        console.log("fail canvasToTempFilePath", res)
      }
    });
  },
  getToday() {
    var date = new Date();
    let t;
    year = date.getFullYear();
    month = date.getMonth() + 1;
    if(month < 10) month = '0' + month
    day = date.getDate();
    let res = "_" + year + month + day
    return res
  },
  uploadToDB() {
    // 如果有数据，那么是更新，如果没有数据那么是添加
    let that = this
    console.log("app.globalData", app.globalData)
    let id = app.globalData.open_ID;
    let img = this.data.img_path
    let imgSum = this.data.imgSum_path
    let data = this.data.data1
    let time = this.getToday()
    db.collection('dataOneDay').where({
        time: time,
        patientId: id
      }).get()
      .then(res => {
        console.log("res while searching in dataOneDay", res)
        if (res.data.length > 0) {
          // 更新
          that.update_DataOneDay(img, imgSum, data, id, time)
        } else
          that.add_DataOneDay(img, imgSum, data, id, time)
      })
  },
  update_DataOneDay(imgPath, imgSumPath,  data, id, time) {
    db.collection('dataOneDay').where({
        time: time,
        patientId: id
      })
      .update({
        data: {
          noon: data[1],
          night: data[2],
          img: imgPath,
          imgSum: imgSumPath
        }
      })
      .then(res => {
        console.log("res after updating in com.js", res)
      })
  },
  add_DataOneDay(imgPath, imgSumPath, data, id, time) {
    db.collection('dataOneDay').add({
        data: {
          img: imgPath,
          imgSum: imgSumPath,
          morning: data[0],
          noon: [],
          night: [],
          patientId: id,
          time: time
        }
      })
      .then((res) => {
        console.log("res after adding data to dataOneDay", res)
      })
  },
  update() {
    var that = this;
    // 出现提示框
    that.setData({
      hiddenall: false
    })
    // 开始上传数据
    setTimeout(() => {
      that.down('#mychart-dom-line', false);
      that.down('#mychart-dom-line-Sum', true);
    }, 1000);
  },
  get_infoP() {
    var that = this;
    var img_path = that.data.img_path;
    var user = app.globalData.open_ID;
    var dnew = that.data.dnew,
      f1 = that.data.f1,
      f2 = that.data.f2,
      index = that.data.index,
      user_data = that.data.user_data;
    var len = app.globalData.len;
    var data_n = {};
    if (dnew == 0) {
      user_data["mydata"] = [];
      data_n["year"] = app.globalData.time_n.year;
      data_n["month"] = app.globalData.time_n.month;
      data_n["day"] = app.globalData.time_n.day;
      data_n["hour"] = app.globalData.time_n.hour;
      data_n["minutes"] = app.globalData.time_n.minutes;
      data_n["today"] = [];
      var tmp = {};
      tmp["data"] = app.globalData.data2[len - 1];
      tmp["img"] = img_path;
      if (data_n.hour < 12) tmp["tag"] = "早上";
      else tmp["tag"] = "晚上";
      data_n["today"].push(tmp);
      user_data["mydata"].push(data_n);
    } else {
      if (f1 == 0) {

        data_n["year"] = app.globalData.time_n.year;
        data_n["month"] = app.globalData.time_n.month;
        data_n["day"] = app.globalData.time_n.day;
        data_n["hour"] = app.globalData.time_n.hour;
        data_n["minutes"] = app.globalData.time_n.minutes;
        data_n["today"] = [];
        var tmp = {};
        tmp["data"] = app.globalData.data2[len - 1];
        tmp["img"] = img_path;
        if (data_n.hour < 12) tmp["tag"] = "早上";
        else tmp["tag"] = "晚上";
        data_n["today"].push(tmp);
        user_data["mydata"].push(data_n);
      } else {
        if (f2 == 1) {
          data_n = user_data["mydata"][index];
          var tmp = {};
          var hour = app.globalData.time_n.hour;
          tmp["data"] = app.globalData.data2[len - 1];
          tmp["img"] = img_path;
          if (data_n.hour < 12 && hour < 12) {
            wx.showModal({
              title: '提示',
              content: '早间检测已完成',
              success: function (res) {
                if (res.confirm) { //这里是点击了确定以后
                  console.log('用户点击确定')
                  that.setData({
                    hiddenall: true
                  })
                  wx.navigateTo({
                    url: '../login/login',
                  })
                } else { //这里是点击了取消以后
                  console.log('用户点击取消')
                  that.setData({
                    hiddenall: true
                  })

                }

              }

            })
            return;
          } else if (data_n.hour >= 12 && hour >= 12) {
            wx.showModal({

              title: '提示',

              content: '晚间检测已完成',

              success: function (res) {

                if (res.confirm) { //这里是点击了确定以后

                  console.log('用户点击确定')
                  that.setData({
                    hiddenall: true
                  })
                  wx.navigateTo({
                    url: '../login/login',
                  })

                } else { //这里是点击了取消以后

                  console.log('用户点击取消')
                  that.setData({
                    hiddenall: true
                  })


                }

              }

            })
            return;
          } else tmp["tag"] = "晚上";

          data_n["today"].push(tmp);
          user_data["mydata"].push(data_n);
        } else {
          wx.showModal({

            title: '提示',

            content: '今日份检测已完成',

            success: function (res) {

              if (res.confirm) { //这里是点击了确定以后

                console.log('用户点击确定')

              } else { //这里是点击了取消以后

                console.log('用户点击取消')

              }

            }

          })
          console.log("今日份检测已完成！！！");
          return;
        }
      }
    }
    console.log('USER:', user);
    if (that.data.flag == 2) {
      DB2.where({
        openid: user
      }).update({
        data: {
          mydata: user_data["mydata"]
        },
        success(res) {
          console.log('res', res);
          that.setData({
            hiddenall: true
          })
          wx.navigateTo({
            url: '../login/login',
          })
        }
      })
    }
  }
})