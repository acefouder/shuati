// pages/create/create.js
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: true,
    userInfo: null,
    classics: [],
    collect_history: 0,
    browsing_history:0,
    browsing_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.hasGottenUserInfo()
    this.queryCollectHistory()
    this.queryBrowsingHistory()
  },

  hasGottenUserInfo: function () {
    wx.getSetting({
      success: (data) => {
        if (data.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (data) => {
              this.setData({
                hasUserInfo: true,
                userInfo: data.userInfo
              })
            }
          })
        } else {
          this.setData({
            hasUserInfo: false
          })
        }
      }
    })
  },

  onGetUserInfo: function (event) {
    let userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: userInfo
      })
    }
  },

  queryCollectHistory: function () {
    const db = wx.cloud.database()
    var that = this
    db.collection('collect_history').get({
      success: res => {
        if (res.data.length > 0) {
          that.setData({
            collect_history: res.data[0].content.length
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
  },
  queryBrowsingHistory: function () {
    const db = wx.cloud.database()
    var that = this
    db.collection('browsing_history').get({
      success: res => {
        if (res.data.length > 0) {
          that.setData({
            browsing_history: res.data[0].content.length,
            browsing_id: res.data[0]._id
          })
          console.log(res)
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
  browsing: function (e) {
    wx.navigateTo({
      url: '../browsing/browsing'
    })
  },
  collect: function (e) {
    wx.navigateTo({
      url: '../collect/collect'
    })
  },
  sponsor: function(){
    wx.previewImage({
      urls: ['https://6761-gaokao-pqfpp-1301652024.tcb.qcloud.la/webwxgetmsgimg.jpg?sign=d2257ec4c83ec9ce431c338fa086061c&t=1585127507'] // 需要预览的图片http链接列表
    })
  },
  onShareAppMessage() {
    return {
      title: '疯狂刷题',
      path: 'pages/classic/classic'
    }
  },
  handleTapShareButton() {
    if (!((typeof wx.canIUse === 'function') && wx.canIUse('button.open-type.share'))) {
      wx.showModal({
        title: '当前版本不支持转发按钮',
        content: '请升级至最新版本微信客户端',
        showCancel: false
      })
    }
  },
  deleteBrowsing: function(){
    var that = this
      wx.showModal({
        content: '将清除刷过的题目，这些题目将重新出现在刷题模块中。',
        confirmText: '确定',
        cancelText: '取消',
        success(res) {
          if (res.confirm) {
            const db = wx.cloud.database()
            db.collection('browsing_history').doc(that.data.browsing_id).update({
              data: {
                content: [],
                optTime: (new Date().getTime())
              },
              success(res) {
                wx.showToast({
                  icon: 'none',
                  title: '清除记录成功！'
                })
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
              }

            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    
  }
})