import * as echarts from '../../../ec-canvas/echarts';

const app = getApp();

let data1=[[1,2,3,4,5],[6,6,8,9,10]];
let data2=[[1,2,3,4,5],[6,6,8,9,10]];

function initChart(canvas, width, height, dpr) {
  const tmpdata=app.globalData.look;
console.log(tmpdata)
const today=tmpdata.today;
const mytitle=String(tmpdata.year)+"-"+String(tmpdata.month)+"-"+String(tmpdata.day);
const mylengend=[];
const color_list=["#37A2DA", "#67E0E3", "#9FE6B8"];
const mycolor=[];
const myseries=[];
console.log("today",today)
for(var i=0;i<today.length;i++)
{
  var tmp={};
  tmp["name"]=today[i].tag;
  tmp["type"]='line';
  tmp["smooth"]=true;
  tmp["data"]=today[i].data;
  myseries.push(tmp);
  mylengend.push(today[i].tag);
  mycolor.push(color_list[i])
}
console.log("mylengend:",mylengend)
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var A=data1;
  var B=data2;
  console.log("A:",A,"B:",B)
  var option = {
    title: {
      text: mytitle,
      left: 'center'
    },
    color: mycolor,
    legend: {
      data: mylengend,
      top: 'auto',
      left: 'right',
      z:100
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
      nameLocation:'end',
      nameTextStyle:{
        padding:[-20,20,0,-20]
      },
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
    },
    series:myseries
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
  data: {
detail:{},
    ec: {
      onInit: initChart
    },
    ec1: {
        onInit: initChart1
      }
  },
  onLoad: function(){
    this.setData({
      detail:app.globalData.look
    })
    console.log("detail:",this.data.detail)
  },
  onReady() {
  }
});
