// miniprogram/pages/subject/subject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAnswer: false,
    browsingHistory: null,
    title_collect: null,
    isNewBrowsingHistory: true,
    index: 0,
    collects: [],
    browsings: [],
    type: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryBrowsingHistory()
  },

  seeAnswer: function(){
    this.setData({
      showAnswer: true
    });
    if (this.isInArray(this.data.browsings, this.data.title_collect[this.data.index]._id)) {
      return
    }
    this.data.browsings.unshift(this.data.title_collect[this.data.index]._id)
    this.addBrowsingHistory(this.data.title_collect[this.data.index]._id);
  },
  nextQuestion:function(){
    // 如果为略过按钮 - 添加浏览记录
    if(!this.data.showAnswer){
      if (this.isInArray(this.data.browsings, this.data.title_collect[this.data.index]._id)) {
        return
      }
      this.data.browsings.unshift(this.data.title_collect[this.data.index]._id)
      this.addBrowsingHistory(this.data.title_collect[this.data.index]._id)
    }
    if(this.data.index < this.data.title_collect.length - 1){
      this.setData({
        index : this.data.index + 1,
        showAnswer: false
      })
    }else{
      this.queryBrowsingHistory();
      this.setData({
        index: 0,
        showAnswer: false
      })
    } 
  },
  collect:function(){
    if (this.isInArray(this.data.collects, this.data.title_collect[this.data.index]._id)){
      wx.showToast({
        icon: 'none',
        title: '已收藏！'
      })
      return
    }
    this.data.collects.unshift(this.data.title_collect[this.data.index]._id)
    // this.setData({
    //   collects: this.data.collects.unshift(this.data.title_collect[this.data.index]._id)
    // })
    this.queryCollectHistory()
  },
  //查询没有看过的题目
  initData: function(){
    const db = wx.cloud.database()
    const _ = db.command
    var other = this.data.browsingHistory;
    db.collection('java_basic').where({
      _id: _.nin(this.data.isNewBrowsingHistory ? [] : other.content),
      type: this.data.type
    }).get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            title_collect: res.data,
          })
        }
        console.log('[数据库] [查询记录] 成功: ', res)
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
  //添加浏览记录
  addBrowsingHistory: function(id){
    const db = wx.cloud.database()
    const _ = db.command
    var that = this;
    if (this.data.isNewBrowsingHistory){
      db.collection('browsing_history').add({
        data: {
          content: [id],
          optTime: (new Date().getTime())
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          that.setData({
            isNewBrowsingHistory : false,
            browsingHistory:{_id:res._id}
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }else{
      db.collection('browsing_history').doc(that.data.browsingHistory._id).update({
        data: {
          content: _.unshift(id),
          optTime: (new Date().getTime()),
        },
        success: res => {
          console.log('[数据库] [插入记录] 成功，记录 _id: ', res.data._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }


  },
  //查询浏览记录
  queryBrowsingHistory: function(){
    const db = wx.cloud.database()
    var that = this
    db.collection('browsing_history').get({
      success: res => {
        if (res.data.length > 0) {
          that.setData({
            browsingHistory: res.data[0],
            isNewBrowsingHistory: false
          })
        }else{
          that.setData({
            isNewBrowsingHistory: true
          })
        }
        that.initData()
        console.log('[数据库] [查询记录] 成功1: ', res)
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
  //添加收藏
  addCollectHistory: function(){
    const db = wx.cloud.database()
    var id = this.data.title_collect[this.data.index]._id
    db.collection('collect_history').add({
      data: {
        content: [id],
        optTime: (new Date().getTime())
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  //更新收藏记录
  updateCollectHistory: function (_id) {
    const db = wx.cloud.database()
    const _ = db.command
    var id = this.data.title_collect[this.data.index]._id;
    db.collection('collect_history').doc(_id).update({
      data: {
        content: _.unshift(id),
        optTime: (new Date().getTime()),
      },
      success: res => {
        console.log('[数据库] [插入记录] 成功，记录 _id: ', res.data._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  //查询收藏记录
  queryCollectHistory: function(){
    const db = wx.cloud.database()
    var that = this
    db.collection('collect_history').get({
      success: res => {
        if (res.data.length > 0) {
          // 更新收藏记录
          that.updateCollectHistory(res.data[0]._id);
        }else{
          // 添加收藏记录
          that.addCollectHistory();
        }
        wx.showToast({
          icon: 'none',
          title: '收藏成功！'
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
  },
  // 查询数组中是否包含所查询的参数
  isInArray: function(arr, value){
    for(var i = 0; i<arr.length; i++){
      if (value === arr[i]) {
        return true;
      }
    }
    return false;
  },
  actionSheetTap() {
    var that = this
    var itemList = ['趣味英语', '理科必备','满分作文']
    wx.showActionSheet({
      itemList: itemList,
      success(e) {
        console.log(e.tapIndex)
        var type = e.tapIndex + 1
        // type = 
        that.setData({
          type: type.toString(),
          showAnswer: false
        })
        that.queryBrowsingHistory()
        var title = itemList[e.tapIndex]
        wx.setNavigationBarTitle({
          title,
          success() {
            console.log('setNavigationBarTitle success')
          },
          fail(err) {
            console.log('setNavigationBarTitle fail, err is', err)
          }
        })
      }
    })
  } 
})