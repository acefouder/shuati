// pages/classic/classic.js
var util = require('../../utils/util.js')
var showToast = require('../../utils/showToast.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '0',
    image: 'https://6761-gaokao-pqfpp-1301652024.tcb.qcloud.la/360%E6%88%AA%E5%9B%BE20200325174708908.jpg?sign=5260655c1e05c61ea4b60263a70388e9&t=1585129670',
    content: ''
  },
  
  // onLoad: function (options) {
  //   this.queryBrowsingHistory()
  // },
  onShow:function(){
    this.queryBrowsingHistory()
  },

// 查询记录次数
  queryBrowsingHistory: function () {
    const db = wx.cloud.database()
    var that = this
    db.collection('browsing_history').get({
      success: res => {
        if (res.data.length > 0) {
          that.setData({
            index: res.data[0].content.length,
            content: '您已刷题' + res.data[0].content.length + '道！'
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }
})