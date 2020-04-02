// pages/classic/classic.js
var util = require('../../utils/util.js')
var showToast = require('../../utils/showToast.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  onLoad: function (options) {
    //初始化首页数据
    this.queryBrowsingHistory()
  },

  remove: function (array, val) {
       for (var i = 0; i < array.length; i++) {
          if (array[i] == val) {
            array.splice(i, 1);
      } 
    }
     return -1;
  },


  // 删除记录
  deleteItem: function (e) {
    console.log(e.detail.content._id)
    this.remove(this.data.myBrowsing, e.detail.content._id)
    const db = wx.cloud.database()
    const _ = db.command
    // if (this.data.myBrowsing.length === 0){
    //   db.collection('browsing_history').doc(this.data.id).remove({
    //     success(res) {
    //       console.log(res.data)
    //     }
    //   })
    // }else{
      db.collection('browsing_history').doc(this.data.id).update({
        data: {
          content: this.data.myBrowsing
        },
        success: res => {
          console.log(res.data)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    // }
    
  },
  onReachBottom: function (ids) {
    var that = this
    wx.cloud.callFunction({
      name: 'queryAllData',
      data: {
        tableName: 'java_basic',
        ids: ids
      },
      success:res => {
        that.setData({
          list: res.result.data,
        })
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  queryBrowsingHistory: function () {
    const db = wx.cloud.database()
    var that = this
    db.collection('browsing_history').get({
      success: res => {
        if (res.data.length > 0) {
          that.setData({
            myBrowsing: res.data[0].content,
            id: res.data[0]._id
          })
          this.setNaivgationBarTitle(res.data[0].content.length)
          that.onReachBottom(res.data[0].content)
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
  },
  click: function (e) {
    // e.detail.content
    wx.navigateTo({
      url: '../details/details?title=' + e.detail.content.title.replace(/\?/g, '？').replace(/\&/g, '￥') + '&answer=' + e.detail.content.answer.replace(/\?/g, '？').replace(/\&/g, '￥')
    })
  },
  setNaivgationBarTitle(count) {
    const title = '已刷'+count+'道题目'
    console.log(title)
    wx.setNavigationBarTitle({
      title,
      success() {
        console.log('setNavigationBarTitle success')
      },
      fail(err) {
        console.log('setNavigationBarTitle fail, err is', err)
      }
    })

    return false
  }
})