// pages/catelog/catelog.js
var localData = require("../catelog/data.js");
var p_localData = require("../catelog/p_data.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    left_list: ['2022.11.28', '2022.11.29', '2022.11.30'],
    dataOneDay: {
      time: '2022.11.28',
      data: [{
        'FVC': 1,
        'FEV1': 2,
        'PEF': 3,
        'PEFR': 4

      }, {
        'FVC': 1,
        'FEV1': 2,
        'PEF': 3,
        'PEFR': 4
      }, {
        'FVC': 1,
        'FEV1': 2,
        'PEF': 3,
        'PEFR': 4

      }]
    },
    right_content: [],
    current: 0,
    scrollTOP: 0,
    flag: app.globalData.haveFlag
  },
  Cates: [],
  handleindex(e) {
    const {
      index
    } = e.currentTarget.dataset;
    // let right_content = localData.dataList[index].children;
    let data = [{
        time: '2022.11.28',
        data: [{
          'FVC': 1,
          'FEV1': 2,
          'PEF': 3,
          'PEFR': 4

        }, {
          'FVC': 1,
          'FEV1': 2,
          'PEF': 3,
          'PEFR': 4
        }, {
          'FVC': 1,
          'FEV1': 2,
          'PEF': 3,
          'PEFR': 4

        }]
      },
      {
        time: '2022.11.28',
        data: [{
          'FVC': 123,
          'FEV1': 23,
          'PEF': 3,
          'PEFR': 4

        }, {
          'FVC': 1,
          'FEV1': 2,
          'PEF': 3,
          'PEFR': 4
        }, {
          'FVC': 1,
          'FEV1': 2,
          'PEF': 3,
          'PEFR': 4

        }]
      },
      {
        time: '2022.11.28',
        data: [{
          'FVC': 124,
          'FEV1': 2,
          'PEF': 3324,
          'PEFR': 4

        }, {
          'FVC': 1,
          'FEV1': 2,
          'PEF': 3,
          'PEFR': 4
        }, {
          'FVC': 1,
          'FEV1': 2,
          'PEF': 3,
          'PEFR': 4

        }]
      }
    ]
    let right_content = data[index].data
    this.setData({
      current: index,
      right_content,
      scrollTOP: 0
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      this.Cates = localData.dataList;
      wx.setStorageSync("cates", {
        time: Date.now(),
        data: this.Cates
      });
      // let left_list = localData.dataList.map(v => v.cat_name);
      let right_content = localData.dataList[0].children;
      this.setData({
        left_list,
        right_content
      })
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        this.Cates = localData.dataList;
        wx.setStorageSync("cates", {
          time: Date.now(),
          data: this.Cates
        });
        let left_list = localData.dataList.map(v => v.cat_name);
        let right_content = localData.dataList[0].children;
        this.setData({
          left_list,
          right_content
        })
      } else {
        this.Cates = localData.dataList;
        // wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
        let left_list = localData.dataList.map(v => v.cat_name);
        let right_content = localData.dataList[0].children;
        this.setData({
          left_list,
          right_content
        })
      }
    }
    let left_list = ['2022.11.28', '2022.11.29', '2022.11.30']
    this.setData({
      left_list
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },
  //  点击tabbar跳转函数
  //  flag是参数 flag 1：医生；2： 病人
  goIndex: function () {
    wx.redirectTo({
      url: `../index/index?flag=${this.data.flag}`
    })
  },
  goList: function () {
    wx.redirectTo({
      url: `../catelog/catelog?flag=${this.data.flag}`
    })
  },
  goSearch: function () {
    wx.redirectTo({
      url: `../search/search?flag=${this.data.flag}`
    })
  },
  goCenter: function () {
    wx.redirectTo({
      url: `../login/login?flag=${this.data.flag}`
    })
  }
})