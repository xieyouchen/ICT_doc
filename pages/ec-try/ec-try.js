const app = getApp()
var util=require('../../utils/util.js')
import * as echarts from '../../ec-canvas/echarts';
let data1=[[1,2,3,4,5],[6,6,8,9,10]];
let chart_ins=null;
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  let len=app.globalData.len;
  var A=data1//[app.globalData.data_p[len-1],app.globalData.data_p[len-1]];//data1;
  //var B=data2;
  console.log("A:",A)
  var option = {
    title: {
      text: "2021-4-26",// title,
      left: 'center'
    },
    color: ["#37A2DA", "#67E0E3"],
    legend: {
      data: ['早上', '晚上'],
      top: 50,
      left: 'center',
     
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
      name:"时间",
      type: 'category',
      boundaryGap: false,
      data: ['第0.5s', '第1.0s', '第1.5s', '第2.0s', '第2.5s', '第3.0s'],
      // show: false
    },
    yAxis: {
      name:"用力肺活量",
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
      data: A[0]//[18, 36, 65, 30, 78, 40, 33]
    }, {
      name: '晚上',
      type: 'line',
      smooth: true,
      data: A[1]// [12, 50, 51, 35, 70, 30, 20]
    }/*{
      name: 'C',
      type: 'line',
      smooth: true,
      data:A[0]// [10, 30, 31, 50, 40, 20, 10]
    }*/]
  };

  chart.setOption(option);
  chart_ins=chart;
  return chart;
}

function initChart1(canvas, width, height, dpr) {
    const chart1 = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart1);
  
    var data = [];
    var data2 = [];
  
    for (var i = 0; i < 10; i++) {
      data.push(
        [
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 40)
        ]
      );
      data2.push(
        [
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100)
        ]
      );
    }
  
    var axisCommon = {
      axisLabel: {
        textStyle: {
          color: '#C8C8C8'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#fff'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#C8C8C8'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#C8C8C8',
          type: 'solid'
        }
      }
    };
  
    var option1= {
      color: ["#FF7070", "#60B6E3"],
      backgroundColor: '#eee',
      xAxis: axisCommon,
      yAxis: axisCommon,
      legend: {
        data: ['aaaa', 'bbbb']
      },
      visualMap: {
        show: false,
        max: 100,
        inRange: {
          symbolSize: [20, 70]
        }
      },
      series: [{
        type: 'scatter',
        name: 'aaaa',
        data: data
      },
      {
        name: 'bbbb',
        type: 'scatter',
        data: data2
      }
      ],
      animationDelay: function (idx) {
        return idx * 50;
      },
      animationEasing: 'elasticOut'
    };
  
  
    chart1.setOption(option1);
    return chart1;
  }

Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag:0,
    f1:0,
    img:null,
    f2:0,
    index:0,
    user_data:{},
    dnew:1,
    receiverText: '',
    receiverLength: 0,
    sendText: '',
    sendLength: 0,
    time: 1000,
    timeSend: false,
    ec: {
      onInit: initChart
    },
    ec1: {
        onInit: initChart1
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
  base64ToBlob(code) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
},
onReady() {
  // tips:正常逻辑不建议这么写，需要保证initChart之后再执行下载
  
},
down1(){
  setTimeout(() => {
    this.down();
  }, 10);
},
down(){
    
  const ecComponent = this.selectComponent('#mychart-dom-line');
  console.log("ecC:",ecComponent)
  // 先保存图片到临时的本地文件，然后存入系统相册
  ecComponent.canvasToTempFilePath({
      success(res){
        console.log("云端上传开始");
        console.log("tempFilePath:", res.tempFilePath)
        var tempFilePath=res.tempFilePath;
        var time = new Date().toLocaleString;
        wx.cloud.uploadFile({
          cloudPath: '1' + '.jpg', // 上传至云端的路径
          filePath: tempFilePath, // 小程序临时文件路径
          success: res => {
              console.log("上传云端成功",res);
          },
          fail: console.error
      })
        // 存入系统相册
        // wx.saveImageToPhotosAlbum({
        //   filePath: res.tempFilePath || '',
        //   success: res => {
        //     console.log("success", res)
        //   },
        //   fail: res => {
        //     console.log("fail", res)
        //   }
        // })
      },
      fail(res){
        console.log("fail canvasToTempFilePath",res)
      }
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      flag: app.globalData.haveFlag
    })
    const self = this
    var user=app.globalData.open_ID;
    console.log('USER:',user);
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
        success: function(res) {
          // do something...
        }
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
})