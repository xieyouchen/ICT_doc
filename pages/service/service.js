const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    services: []
  },
  /**
   * 自定义数据
   */
  customData: {
    deviceName: '',
    deviceId: '',
    services: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    this.customData.deviceId = options.deviceId
    this.customData.deviceName = options.deviceName
    this.setData({
      name: options.deviceName
    })
    /**
     * 获取蓝牙设备服务列表
     */
    wx.getBLEDeviceServices({
      deviceId: options.deviceId,
      success: function(res) {
        var services = res.services.filter((item, i) => {
          return !/^000018/.test(item.uuid)
        })
        var services1=[];
       // services1.push(services[0]);
        for(var i=0;i<services.length-1;i++){
          var f=1;
          for(var j=0;j<i;j++){
            if(services[i].uuid==services[j].uuid){
                f=0;break;
            }
          }
          if(f==1)services1.push(services[i]);
        }
        //services=Array.from(new Set(services));
        self.customData.services = services
        self.setData({
          services: services
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '设备服务获取失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 监听页面初次渲染完成
   */
  onReady: function () {
    app.stopSearchDevs(); // 停止搜索
  },
  /**
   * 监听页面卸载
   */
  onUnload: function () {
    app.endConnect(this.customData.deviceId)
  },
  /**
   * 跳转获取特征值页面
   */
  getCharacteristic (event) {
    if (app.globalData.connectState) {
      const deviceName = this.customData.deviceName
      const serviceId = event.currentTarget.dataset.uuid
      const deviceId = this.customData.deviceId
      wx.navigateTo({
        url: `/pages/characteristic/characteristic?deviceName=${deviceName}&deviceId=${deviceId}&serviceId=${serviceId}`,
      })
    } else {
      wx.showToast({
        title: '未连接蓝牙设备',
        icon: 'none'
      })
    }
  }
})