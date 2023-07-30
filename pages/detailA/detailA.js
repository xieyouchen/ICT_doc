import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
// const tmpdata=app.globalData.look;
// console.log(tmpdata)
// const today=tmpdata.today;
// const mytitle=String(tmpdata.year)+"-"+String(tmpdata.month)+"-"+String(tmpdata.day);
// const mylengend=[];
// const color_list=["#37A2DA", "#67E0E3", "#9FE6B8"];
// const mycolor=[];
// const myseries=[];
// console.log("today",today)
// if(today!=null)
// for(var i=0;i<today.length;i++)
// {
//   var tmp={};
//   tmp["name"]=today[i].tag;
//   tmp["type"]='line';
//   tmp["smooth"]=true;
//   tmp["data"]=today[i].data;
//   myseries.push(tmp);
//   mylengend.push(today[i].tag);
//   mycolor.push(color_list[i])
// }
// console.log("mylengend:",mylengend)
let data1 = [
  [1, 2, 3, 4, 5],
  [6, 6, 8, 9, 10]
];
let data2 = [
  [1, 2, 3, 4, 5],
  [6, 6, 8, 9, 10]
];
const myseries_Sum = [];
function getMyseries_Sum() {
  let myseries_Sum = [];
  let app = getApp()
  const tmpdata = app.globalData.look;
  const today = tmpdata.today;
  if (today != null)
    for (var i = 0; i < today.length; i++) {
      var tmp = {};
      tmp["name"] = today[i].tag;
      tmp["type"] = 'line';
      tmp["smooth"] = true;
      let data_sum = [0]
      let dataTmp = today[i].data
      for(let i = 2 ; i < dataTmp.length ; i++) {
        let num = dataTmp[i] - dataTmp[i-1]
        num = parseInt(num/0.045 * 15)
        data_sum.push(num)
      }
      tmp["data"] = data_sum;
      myseries_Sum.push(tmp);
      return myseries_Sum
}}
function initChartSum(canvas, width, height, dpr) {
  const tmpdata = app.globalData.look;
  console.log("tmpData: #####")
  console.log(tmpdata)
  const today = tmpdata.today;
  const mytitle = String(tmpdata.year) + "-" + String(tmpdata.month) + "-" + String(tmpdata.day);
  const mylengend = [];
  const color_list = ["#37A2DA", "#67E0E3", "#9FE6B8"];
  const mycolor = [];
  console.log("today", today)
  if (today != null)
    for (var i = 0; i < today.length; i++) {
      var tmp = {};
      tmp["name"] = today[i].tag;
      tmp["type"] = 'line';
      tmp["smooth"] = true;
      let data_sum = [0]
      let dataTmp = today[i].data
      for(let i = 2 ; i < dataTmp.length ; i++) {
        let num = dataTmp[i] - dataTmp[i-1]
        num = parseInt(num/0.045 * 15)
        data_sum.push(num)
        console.log("num in detailA.js", num)
      }
      tmp["data"] = data_sum;
      myseries_Sum.push(tmp);
      console.log("###########", myseries_Sum)
      mylengend.push(today[i].tag);
      mycolor.push(color_list[i])
    }
    console.log("myseries_Sum", myseries_Sum)
  console.log("mylengend:", mylengend)
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var A = data1;
  var B = data2;
  console.log("A:", A, "B:", B)
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
  console.log("tmpData: #####")
  console.log(tmpdata)
  const today = tmpdata.today;
  const mytitle = String(tmpdata.year) + "-" + String(tmpdata.month) + "-" + String(tmpdata.day);
  const mylengend = [];
  const color_list = ["#37A2DA", "#67E0E3", "#9FE6B8"];
  const mycolor = [];
  const myseries = [];
  console.log("today", today)
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
  console.log("mylengend:", mylengend)
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var A = data1;
  var B = data2;
  console.log("A:", A, "B:", B)
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

  var option1 = {
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
  data: {
    show: true,
    detail: {},
    ec: {
      onInit: initChart
    },
    ec1: {
      onInit: initChart1
    },
    ecSum: {
      onInit: initChartSum
    }
  },
  switchLineChart() {
    console.log("now switch")
    initChart()
  },
  getPEFR(todayData) {
    let arr_pef = []
    console.log(todayData)
    todayData.forEach(e => {
      arr_pef.push(this.max(e.data))
    })
    console.log(arr_pef)
    let max = this.max(arr_pef)
    let min = this.min(arr_pef)
    let res = 2*(max-min)/(max+min) * 100
    return res
  },
  max(arrData) {
    console.log("arrData in max()", arrData)
    let pef = 0
    arrData.sort()
    pef = arrData[arrData.length-1]
    return pef
  },
  min(arrData) {
    let pef = 0
    arrData.sort()
    pef = arrData[0]
    return pef
  },
  getFactors(todayData) {
    let detail_factors = []
    let myseries_Sum = getMyseries_Sum()
    console.log("myseries_Sum in detailA.js", myseries_Sum)
    let pefr = this.getPEFR(myseries_Sum)
    for(let i = 0 ; i < todayData.length ; i++) {
      let e = todayData[i]
      console.log(i, e.data.length)
      if(e.data.length == 1) break
      let dataTmp = e.data
      let fev1 = dataTmp[dataTmp.length-1] - dataTmp[0]
      let morning_Or_noon_Or_night = myseries_Sum[i]
      let pef = ""
      if(!morning_Or_noon_Or_night) {
        pef = 463
        pefr = 2*(463-373)/(463+373) * 100
        pefr = parseFloat(pefr.toFixed(2))
      }
      if(morning_Or_noon_Or_night) {
        let arrData = myseries_Sum[i].data
        pef = this.max(arrData)
        console.log(pef)
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
      console.log("data", data)
    }
    console.log("detail_factors", detail_factors)
    this.setData({
      detail_factors
    })
  },
  onLoad: function () {
    let app = getApp()
    this.setData({
      detail: app.globalData.look
    })
    this.getFactors(this.data.detail.today)
    console.log("detail:", this.data.detail.today[1])
  },
  onReady() {}
});