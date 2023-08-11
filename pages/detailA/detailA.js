import * as echarts from '../../ec-canvas/echarts';

let app = getApp();
let myseries_Sum = [];

function initChartSum(canvas, width, height, dpr) {
  const tmpdata = app.globalData.look;
  const today = tmpdata.today;
  const mylengend = [];
  const color_list = ["#37A2DA", "#67E0E3", "#9FE6B8"];
  const mycolor = [];
  myseries_Sum = []
  if (today != null)
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
    // series: [{
    //   name: mylengend[0],
    //   type: 'line',
    //   smooth: true,
    //   data: today[0].data//[18, 36, 65, 30, 78, 40, 33]
    // }]
  };

  chart.setOption(option);
  return chart;
}

function initChart(canvas, width, height, dpr) {
  const tmpdata = app.globalData.look;
  const today = tmpdata.today;
  const mylengend = [];
  const color_list = ["#37A2DA", "#67E0E3", "#9FE6B8"];
  const mycolor = [];
  const myseries = [];
  if (today != null)
    for (var i = 0; i < today.length; i++) {
      var tmp = {};
      tmp["name"] = today[i].tag;
      tmp["type"] = 'line';
      tmp["smooth"] = true;
      tmp["data"] = today[i].data;
      myseries.push(tmp);
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
      name: "呼气总量(L)",
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: myseries
    // series: [{
    //   name: mylengend[0],
    //   type: 'line',
    //   smooth: true,
    //   data: today[0].data//[18, 36, 65, 30, 78, 40, 33]
    // }]
  };

  chart.setOption(option);
  return chart;
}

Page({
  data: {
    show: true,
    detail: {},
    detail_factors: [],
    ec: {
      onInit: initChart
    },

    ecSum: {
      onInit: initChartSum
    }
  },
  getPEFR(todayData, cnt) {
    let arr_pef = []
    for(let i = 0 ; i < cnt ; i++) {
      arr_pef.push(this.max(todayData[i].data))
    }
    let max = this.max(arr_pef)
    let min = this.min(arr_pef)
    let res = 2 * (max - min) / (max + min) * 100
    res = parseFloat(res.toFixed(2))
    return res
  },
  max(arrData) {
    let pef = 0
    arrData.sort((a,b) => {return a-b})
    pef = arrData[arrData.length - 1]
    return pef
  },
  min(arrData) {
    let pef = 0
    arrData.sort((a,b) => {return a-b})
    pef = arrData[0]
    return pef
  },
  // 计算PEF肺活量值用的数组数据，用得到的吹气数据，两个数据之差作为每个时间段的PEF
  getMyseries_Sum() {
    let myseries_Sum = [];
    let app = getApp()
    const tmpdata = app.globalData.look;
    const today = tmpdata.today;
    console.log("today in getMyseries_Sum()", today)
    if (today != null)
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
      }
    return myseries_Sum
  },
  getFactors(todayData) {
    // console.log("todayData in getFac", todayData)
    let detail_factors = []
    // 肺活量峰值，L/min
    let myseries_Sum = this.getMyseries_Sum()
    console.log("myseries_Sum in getFactors()", myseries_Sum)
    // 以下得到 detail_factor，最后的渲染数据
    for (let i = 0; i < todayData.length; i++) {
      let e = todayData[i]
      // 如果是中午或者晚上数据为空，那么就跳出循环
      if (e.data.length == 1) break
      let dataTmp = e.data
      let fev1 = dataTmp[dataTmp.length - 1] - dataTmp[0]
      let morning_Or_noon_Or_night = myseries_Sum[i]
      console.log("早或中或晚的数据", morning_Or_noon_Or_night)
      let pef = ""
      // 计算 pefr
      let pefr = this.getPEFR(myseries_Sum, i+1)
      if (morning_Or_noon_Or_night) {
        let arrData = myseries_Sum[i].data
        pef = this.max(arrData)
      }
      let tag = e.tag
      let data = []
      data.push(fev1)
      data.push(pef)
      data.push(pefr)
      detail_factors.push({
        tag,
        data
      })
    }
    this.setData({
      detail_factors
    })
  },
  onLoad: function (options) {
    let app = getApp()
    // 翻转 .look 内的数据
    let detail = app.globalData.look
    this.setData({
      detail
    })
    console.log("options in detailA.js", options)
    let imgSum = options.imgSum
    let img = detail.today[0].img
    this.setData({
      imgSum,
      img
    })
    this.getFactors(this.data.detail.today)
  },
  onReady() {}
});