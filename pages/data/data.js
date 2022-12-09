// pages/data/data.js
var util=require('../../utils/util.js')
const app = getApp()
let data1=[app.globalData.data2,app.globalData.data2];
console.log("data1:",data1)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data_tot:[], //页面显示的数据表
   // last:[],
    len:0,
    data_p:[],
    toView:"toView",
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
      data_tot:app.globalData.data2,
      len:app.globalData.len,
      data_p:app.globalData.data_p
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
      wx.notifyBLECharacteristicValueChange({  //// 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
        deviceId: options.deviceId,
        serviceId: options.serviceId,
        characteristicId: options.characteristicId,
        state: true,
        success: function(res) {
          // do something...
          console.log("123 res", res)
        }
      })
    }
  },

  //转十六进制
  hexStringToArrayBuffer: function(command){
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
    console.log("hexStringToArrayBuffer: ",buffer);
    return buffer;
  },

  ab2hex: function(command){
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    console.log(hexArr);
    return hexArr.join('');
  },

  
//向蓝牙发送数据
// sendTohardWare: function(){
//   var sendData = "12345f6ewaffew15f6ew4fewf4d2sa1554ew4a5fd5ef1d5s4few5few"//需要发送的数据
//   let buffer = hexStringToArrayBuffer(sendData );//转16进制
//   let pos = 0;
//   let bytes = buffer.byteLength;
//   var result = ''
//   while (bytes > 0) {
//     let tmpBuffer;
//     if (bytes > 20) {
//       tmpBuffer = buffer.slice(pos, pos + 20);
//       pos += 20;
//       bytes -= 20;
//       wx.writeBLECharacteristicValue({
//         deviceId: this.data.w_deviceId,
//         serviceId: this.data.w_serviceId,
//         characteristicId: this.data.w_characteristicId,
//         value: tmpBuffer,
//         success(res) {
//           console.log('发送成功！', res)
//         }
//       })
//       sleep(0.02)
//     } else {
//       tmpBuffer = buffer.slice(pos, pos + bytes);
//       pos += bytes;
//       bytes -= bytes;
//       wx.writeBLECharacteristicValue({
//         deviceId: this.data.w_deviceId,
//         serviceId: this.data.w_serviceId,
//         characteristicId: this.data.w_characteristicId,
//         value: tmpBuffer,
//         success(res) {
//           console.log('最后次发送', res)
//           //发送完成获取返回值
//           //注：蓝牙有可能会分包给你返回也有可能一次性返回
//           wx.onBLECharacteristicValueChange(function (characteristic) {
//             //判断是否已经接收完返回值
//             //根据自己蓝牙硬件返回的格式判断是否接收完成，如果没接收完继续接收
//             //ab2hex 是16进制转10进制
//             result = result + ab2hex(characteristic.value)
//             //比如硬件返回给你参数指定了长度，你就可以根据长度判断
//             if (result.length == 18) {
//               console.log("返回值为："+result)
//             }
//           })
//         },
//         fail: function (res) {
//           console.log('发送失败', res)
//         }
//       })
//     }
//   }

// },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const self = this;
    console.log(" receiverText: ", this.data.receiverText)
    function buf2string(buffer) {
      var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
      console.log("arr: ",arr)
        return arr;
      // return arr.map((char, i) => {
      //   return String.fromCharCode(char);
      // }).join('');
    }
    
    /**
     * 监听蓝牙设备的特征值变化
     */
    wx.onBLECharacteristicValueChange(function (res) {
      console.log("蓝牙 res:",res)
      //mycode
      var receiverText = buf2string(res.value);  //原来有的
      //var receiverText = res.value;
      receiverText = receiverText.splice(10); //因为只要两组数据，每组5个数字，所以从数组中第10个数据开始取
      console.log(receiverText.length)
      //mycode end
      //app.globalData.data2=receiverText;
      let tmpdata = receiverText
      let tmpreceiverText = self.data.receiverText
      //tmpdata = [...self.data.receiverText].push(receiverText)
      tmpreceiverText.push(...tmpdata)
      self.setData({
        //receiverText: (self.data.receiverText + receiverText).substr(-4000, 4000)
        receiverLength: self.data.receiverLength + receiverText.length, 
        receiverText: tmpreceiverText
      })
      // setTimeout(() => {
      //    self.setData({
      //      //receiverText: (self.data.receiverText + receiverText).substr(-4000, 4000)
      //      receiverLength: self.data.receiverLength + receiverText.length, 
      //      receiverText: self.data.receiverText.push(receiverText)
      //    })
      //  }, 200)
    if(self.data.receiverLength < 30) return; //当数组长度小于20， 重新加载该页面
    //   //var result=receiverText.split("\n\n")
       var tmp=[],rest=[],p=[];
       var fn=false;
       tmp = self.data.receiverText;
       //console.log("receive:",self.data.receiverText) //清零之前输出一下
      //  //数据读取完之后，便清空缓冲区
      self.setData({
        receiverLength: 0,
        receiverText: []
        })

       //下面是本来有的，被我注释掉了
       // for(var i=0;i<result.length;i++)
       // {
       //   if(result[i]!=""){
       //     tmp=result[i].split(" ");
       //   }
       // }
        for(var i=0;i<tmp.length;i++)
        {
      rest.push(Number(tmp[i]));
        if(Number.isNaN(Number(tmp[i])))fn=true
          if(i!=0){
            p.push(Number(tmp[i])-Number(tmp[i-1]));
          }
        }
       //console.log("receive:",self.data.receiverText)
       console.log("rest:",rest)
       data1[0]=rest;
       data1[1]=rest;
       if(rest.length<6||fn){
    //     this.sendTohardWare(); //吹气无效，向开发板发送数据
         wx.showModal({

           title: '提示',
     
           content: '吹气无效，请再吹一次',
     
           success: function (res) {
     
             if (res.confirm) {//这里是点击了确定以后
     
               console.log('用户点击确定')
     
             } else {//这里是点击了取消以后
     
               console.log('用户点击取消')
     
             }
     
           }
          
         })
       }else
       app.globalData.data2.push(rest);
       var len=self.data.len;
       len=len+1;
       app.globalData.len=len;
       console.log("p:",p)
       if(rest.length<6||fn){
        
       }else
       app.globalData.data_p.push(p);
       console.log("data2:",app.globalData.data2);
       var date=new Date()
       var time_n={}
       time_n["year"]=date.getFullYear();
       time_n["month"]=date.getMonth()+1;
       time_n["day"]=date.getDate();
       time_n["hour"]=date.getHours();
       time_n["minutes"]=date.getMinutes();
       app.globalData.time_n=time_n;
       self.setData({
         data_tot:app.globalData.data2,
         data_p:p,
         toView:"toView",
         len:len
       })
    })
  },
  to(){
    wx.navigateTo({
      url: '/pages/com/com',
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
sendToHardWare(){
//向蓝牙发送数据
var sendData = "12345f6ewaffew15f6ew4fewf4d2sa1554ew4a5fd5ef1d5s4few5few"//需要发送的数据
let buffer = hexStringToArrayBuffer(sendData );//转16进制
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
            console.log("返回值为："+result)
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
    
    /**
     * 监听蓝牙设备的特征值变化
     */
    // wx.onBLECharacteristicValueChange(function (res) {
    //   const receiverText = buf2string(res.value);
    //   console.log("res:",res)
    //   //app.globalData.data2=receiverText;
    //   self.setData({
    //     receiverLength: self.data.receiverLength + receiverText.length
    //   })
    //   setTimeout(() => {
    //     self.setData({
    //       receiverText: (self.data.receiverText + receiverText).substr(-4000, 4000)
    //     })
    //   }, 200)
    //   var result=receiverText.split("\n\n")
    //   var tmp=[],rest=[],p=[];
    //   for(var i=0;i<result.length;i++)
    //   {
    //     if(result[i]!=""){
    //       tmp=result[i].split(" ");
    //     }
    //   }
    //   for(var i=0;i<tmp.length;i++)
    //   {
    //     rest.push(Number(tmp[i]));
    //     if(i!=0){
    //       p.push(Number(tmp[i])-Number(tmp[i-1]));
    //     }
    //   }
    //   console.log("receive:",self.data.receiverText)
    //   console.log("rest:",rest)
    //   data1[0]=rest;
    //   data1[1]=rest;
    //   app.globalData.data2.push(rest);
    //   var len=self.data.len;
    //   len=len+1;
    //   app.globalData.len=len;
    //   console.log("p:",p)
    //   app.globalData.data_p.push(p);
    //   console.log("data2:",app.globalData.data2);
    //   var date=new Date();
    //   var time_n={},t="";
    //   // t=date.getDate();
    //   // console.log("tupe:",typeof t,"t:",t)
    //   time_n["year"]=date.getFullYear();
    //   time_n["month"]=date.getMonth()+1;
    //   time_n["day"]=date.getDate();
    //   time_n["hour"]=date.getHours();
    //   time_n["minutes"]=date.getMinutes();
    //   console.log("time:",time_n)
    //   app.globalData.time_n=time_n;
      
    //   self.setData({
    //     data_tot:app.globalData.data2,
    //     data_p:p,
    //     toView:"toView",
    //     len:len
    //   })
    // })
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
  updateSendText: function(event) {
    const value = event.detail.value
    this.customData.sendText = value
    this.setData({
      sendText: value
    })
  },
  updateTime: function(event) {
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
          self.writeData({ deviceId, serviceId, characteristicId, sendPackage })
        }
      }
    }, self.data.time)
  },
  clearReceiverText: function(event) {
    // this.customData.receiverText = ''
    this.setData({
      receiverText: '',
      receiverLength: 0,
      sendLength: 0
    })
  },
  clearSendText: function(event) {
    this.customData.sendText = ''
    this.setData({
      sendText: '',
      sendLength: 0
    })
  },
  manualSend: function(event) {
    const deviceId = this.customData.deviceId // 设备ID
    const serviceId = this.customData.serviceId // 服务ID
    const characteristicId = this.customData.characteristicId // 特征值ID
    const sendText = this.customData.sendText
    const sendPackage = app.subPackage(sendText) // 数据分每20个字节一个数据包数组
    if (app.globalData.connectState) {
      if (this.customData.canWrite) { // 可写
        this.writeData({ deviceId, serviceId, characteristicId, sendPackage })
      }
    } else {
      wx.showToast({
        title: '已断开连接',
        icon: 'none'
      })
    }
  },
  timeChange (event) {
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
            self.writeData({ deviceId, serviceId, characteristicId, sendPackage })
          }
        }
      }, self.data.time)
    }
  },
  writeData: function ({deviceId, serviceId, characteristicId, sendPackage, index = 0}) {
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
          self.writeData({deviceId, serviceId, characteristicId, sendPackage, index: i}) // 发送成功，发送下一个数据包
        },
        fail: function (res) {
          self.writeData({deviceId, serviceId, characteristicId, sendPackage, index}) // 发送失败，重新发送
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