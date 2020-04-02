var showToast = require('../../utils/showToast.js')
var util = require('../../utils/util.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    startTime: {
      type: String,
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          maxStartTime: newVal
        })
      }
    },
    endTime: {
      type: String,
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          maxEndTime: newVal
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    text_value: '',
    radio_value: '',
    radio_value2: '',
    minStartTime: '',
    maxEndTime: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindstartTimeChange: function(e) {
      this.setData({
        maxStartTime: e.detail.value
      })
    },
    bindendTimeChange: function(e) {
      this.setData({
        maxEndTime: e.detail.value
      })
    },
    submit: function() {

      if (this.data.text_value == '') {
        showToast.show_toast('请填写活动内容')
        return
      }
      if (this.data.radio_value == '') {
        showToast.show_toast('请选择活动类型')
        return
      }
      if (this.data.radio_value2 == '') {
        showToast.show_toast('请选择记录类型')
        return
      }
      //提交数据到数据库
      this.onAdd()
    },
    text_input: function(e) {
      this.setData({
        text_value: e.detail.value
      })
    },
    radioChange: function(e) {
      this.setData({
        radio_value: e.detail.value
      })
    },
    radioChange2: function(e) {
      this.setData({
        radio_value2: e.detail.value
      })
    },

    onAdd: function() {
      var nowDay = util.formatDay(new Date())
      const db = wx.cloud.database()
      const _ = db.command
      var duration = util.duration(nowDay + ' ' + this.data.maxStartTime + ':00', nowDay + ' ' + this.data.maxEndTime + ':00')

      wx.getStorage({
        key: util.formatDay(new Date()),
        success: res => {
          if (res.data != null) {
            db.collection('time_content').doc(res.data._id).update({
              data: {
                content: _.unshift({
                  content: this.data.text_value,
                  startTime: util.parserDate(nowDay + ' ' + this.data.maxStartTime + ':00').getTime(),
                  endTime: util.parserDate(nowDay + ' ' + this.data.maxEndTime + ':00').getTime(),
                  type: this.data.radio_value,
                  duration: duration,
                  optTime: new Date().getTime()
                }),
                createTime: nowDay,
              },
              success: res1 => {
                // 在返回结果中会包含新创建的记录的 _id
                console.log('[数据库] [插入记录] 成功，记录 _id: ', res.data._id)
                wx.reLaunch({
                  url: '/pages/classic/classic'
                })
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
        fail: res => {
          db.collection('time_content').add({
            data: {
              content: [{
                content: this.data.text_value,
                startTime: util.parserDate(nowDay + ' ' + this.data.maxStartTime + ':00').getTime(),
                endTime: util.parserDate(nowDay + ' ' + this.data.maxEndTime + ':00').getTime(),
                type: this.data.radio_value,
                duration: duration,
                optTime: new Date().getTime()
              }],
              createTime: nowDay,
              optTime: (new Date().getTime())
            },
            success: res => {
              // 在返回结果中会包含新创建的记录的 _id
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
              wx.reLaunch({
                url: '/pages/classic/classic'
              })
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
      })
    }
  }
})