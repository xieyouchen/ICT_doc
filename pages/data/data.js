// pages/data/data.js
const app = getApp()
const db = wx.cloud.database()
let data1 = [app.globalData.data2, app.globalData.data2];
// console.log("data1:",data1)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data_tot: [], //页面显示的数据表
    // last:[],
    len: 0,
    data_p: [],
    toView: "toView",
    receiverText: [],
    receiverLength: 0,
    sendText: '',
    sendLength: 0,
    time: 1000,
    timeSend: false
  },
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
    const self = this
    self.setData({
      data_tot: app.globalData.data2,
      len: app.globalData.len,
      data_p: app.globalData.data_p
    })
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
      wx.notifyBLECharacteristicValueChange({ //// 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
        deviceId: options.deviceId,
        serviceId: options.serviceId,
        characteristicId: options.characteristicId,
        state: true,
        success: function (res) {
          // do something...
          console.log("123 res", res)
        }
      })
    }
  },

  //转十六进制
  hexStringToArrayBuffer: function (command) {
    if (!command) {
      return new ArrayBuffer(0);
    }
    var buffer = new ArrayBuffer(command.length);
    let dataView = new DataView(buffer)
    let ind = 0;
    for (var i = 0, len = command.length; i < len; i += 2) {
      let code = parseInt(command.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
    }
    console.log("hexStringToArrayBuffer: ", buffer);
    return buffer;
  },

  ab2hex: function (command) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    console.log(hexArr);
    return hexArr.join('');
  },
  rand() {
    let min = 0
    let max = 100
    let res = Math.random() * (max - min) + min
    console.log("random int in this.rand()", res)
    return res;
  },
  fit(data) {
    // data = [43,45,62,90,106]
    let i,x = 0
    let max, tmp = 0
    let pos = 0
    let a = new Array(10).fill(0)
    let b = new Array(10).fill(0)
    for(i = 1 ; i < 5 ; i++) {
      tmp = data[i] - data[i-1]
      if(tmp >= max) {
        max = tmp
        pos = i
      }
      a[i] = tmp
    }
    if(pos == 4) {
      x = this.rand() % 5
      tmp += x
      a[i] = tmp
      i++
    }
    while(i < 10) {
      x = tmp
      if(x > 1) {
        tmp = this.rand() % (x/2) + (x/2) // 保证降的速度不会太慢
      }
      else tmp = 1

      console.log("tmp in fit()", tmp)
      a[i] = parseInt(tmp)
      i++
    }
    b[0] = this.rand() % a[1]
    if(b[0] == 0) b[0]=1;
    for(let j = 1; j < 10; ++j){ //按照脉冲增速更新所有脉冲
        b[j] = b[j-1]+a[j];
    }
    console.log("b in fit()", b)
    console.log("a in fit()", a)
    // 取偶数位，取 5 个数字
    let res = []
    for(let i = 1 ; i < 10 ; i++) {
      if(i%2) res.push(b[i])
    }
    return res
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const self = this;
    function buf2string(buffer) {
      var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
      // arr = [7, 26, 55, 86, 94]
      // arr = [8, 26, 51, 72, 73]
      console.log("arr before fit()", arr)
      arr = self.fit(arr)
      console.log("res after fit()", arr)
      let res = [0]
      for(let i = 0 ; i < arr.length ; i++) {
        let num = arr[i]*0.045
        num = num.toFixed(2)
        res.push(parseFloat(num))
      }
      console.log("arr: ", res)
      return res;
    }

    /**
     * 监听蓝牙设备的特征值变化
     */
    wx.onBLECharacteristicValueChange(function (res) {
      console.log("蓝牙 res:", res)
      //mycode
      var receiverText = buf2string(res.value); //原来有的
      //var receiverText = res.value;
      // receiverText = receiverText.splice(10); //因为只要两组数据，每组5个数字，所以从数组中第10个数据开始取
      console.log(receiverText)
      let tmpdata = receiverText
      let tmpreceiverText = self.data.receiverText
      tmpreceiverText.push(...tmpdata)
      self.setData({
        receiverLength: self.data.receiverLength + receiverText.length,
        receiverText: receiverText
      })
      var tmp = [],
        rest = [],
        p = [];
      var fn = false;
      tmp = self.data.receiverText;

      //  //数据读取完之后，便清空缓冲区
      self.setData({
        receiverLength: 0,
      })
      for (var i = 0; i < tmp.length; i++) {
        rest.push(Number(tmp[i]));
        if (Number.isNaN(Number(tmp[i]))) fn = true
        if (i != 0) {
          p.push(Number(tmp[i]) - Number(tmp[i - 1]));
        }
      }
      console.log("rest:", rest)
      data1[0] = rest;

      var len = self.data.len;
      len = len + 1;
      app.globalData.len = len;
      console.log("p:", p)
      if (rest.length < 6 || fn) {

      } else
        app.globalData.data_p.push(p);
      console.log("data2:", app.globalData.data2);
      var date = new Date()
      var time_n = {}
      time_n["year"] = date.getFullYear();
      time_n["month"] = date.getMonth() + 1;
      time_n["day"] = date.getDate();
      time_n["hour"] = date.getHours();
      time_n["minutes"] = date.getMinutes();
      console.log("time_n in data.js", time_n)
      app.globalData.time_n = time_n;
      self.setData({
        data_tot: app.globalData.data2,
        data_p: p,
        toView: "toView",
        len: len
      })
    })
  },
  getToday() {
    var date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if(month < 10) month = '0' + month
    let day = date.getDate();
    let res = "_" + year + month + day
    return res
  },
  to() {
    // 获取一天当中其他的数据
    let time = this.getToday()
    let id = app.globalData.open_ID;
    console.log(time, id)
    let arr = this.data.receiverText
    db.collection('dataOneDay').where({
        time: time,
        patientId: id
      }).get()
      .then(res => {
        console.log("res while searching in dataOneDay", res)
        let dataOneDay = []
        if(res.data.length > 0) {
          let data = res.data[0]
          dataOneDay.push(data['morning'])
          dataOneDay.push(data['noon'])
          dataOneDay.push(data['night'])
          // 把刚获取到的蓝牙数据添加到 dataOneDay 数组中，需要区分中午还是晚上
          console.log("dataOneDay in data.js", dataOneDay)
          if(dataOneDay[1].length > 0) {
            // 那么就是 night
            dataOneDay[2] = arr
          }
          else{
            dataOneDay[1] = arr
          }
        }
        else {
          // 是早上的数据
          dataOneDay.push(arr)
          dataOneDay.push([])
          dataOneDay.push([])
        }
        app.globalData.data_p = dataOneDay
        console.log("app.globalData in data.js", app.globalData.data_p)
        wx.navigateTo({
          url: '/pages/com/com',
        })
      })

  },

  //转16进制
  hexStringToArrayBuffer(command) {
    if (!command) {
      return new ArrayBuffer(0);
    }
    var buffer = new ArrayBuffer(command.length);
    let dataView = new DataView(buffer)
    let ind = 0;
    for (var i = 0, len = command.length; i < len; i += 2) {
      let code = parseInt(command.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
    }
    return buffer;
  },

  // ArrayBuffer转16进度字符串示例
  ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },

  //向开发板发送数据
  // 这个函数没有执行过
  sendToHardWare() {
    //向蓝牙发送数据
    var sendData = "12345f6ewaffew15f6ew4fewf4d2sa1554ew4a5fd5ef1d5s4few5few" //需要发送的数据
    let buffer = hexStringToArrayBuffer(sendData); //转16进制
    let pos = 0;
    let bytes = buffer.byteLength;
    var result = ''
    while (bytes > 0) {
      let tmpBuffer;
      if (bytes > 20) {
        tmpBuffer = buffer.slice(pos, pos + 20);
        pos += 20;
        bytes -= 20;
        wx.writeBLECharacteristicValue({
          deviceId: this.data.w_deviceId,
          serviceId: this.data.w_serviceId,
          characteristicId: this.data.w_characteristicId,
          value: tmpBuffer,
          success(res) {
            console.log('发送成功！', res)
          }
        })
        sleep(0.02)
      } else {
        tmpBuffer = buffer.slice(pos, pos + bytes);
        pos += bytes;
        bytes -= bytes;
        wx.writeBLECharacteristicValue({
          deviceId: this.data.w_deviceId,
          serviceId: this.data.w_serviceId,
          characteristicId: this.data.w_characteristicId,
          value: tmpBuffer,
          success(res) {
            console.log('最后次发送', res)
            //发送完成获取返回值
            //注：蓝牙有可能会分包给你返回也有可能一次性返回
            wx.onBLECharacteristicValueChange(function (characteristic) {
              //判断是否已经接收完返回值
              //根据自己蓝牙硬件返回的格式判断是否接收完成，如果没接收完继续接收
              //ab2hex 是16进制转10进制
              result = result + ab2hex(characteristic.value)
              //比如硬件返回给你参数指定了长度，你就可以根据长度判断
              if (result.length == 18) {
                console.log("返回值为：" + result)
              }
            })
          },
          fail: function (res) {
            console.log('发送失败', res)
          }
        })
      }
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const self = this;

    function buf2string(buffer) {
      var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
      return arr.map((char, i) => {
        return String.fromCharCode(char);
      }).join('');
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
  updateSendText: function (event) {
    const value = event.detail.value
    this.customData.sendText = value
    this.setData({
      sendText: value
    })
  },
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
  clearReceiverText: function (event) {
    // this.customData.receiverText = ''
    this.setData({
      receiverText: '',
      receiverLength: 0,
      sendLength: 0
    })
  },
  clearSendText: function (event) {
    this.customData.sendText = ''
    this.setData({
      sendText: '',
      sendLength: 0
    })
  },
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})