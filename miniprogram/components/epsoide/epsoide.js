var util = require('../../utils/util.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: String,
      observer: function (newVal, oldVal, changedPath) {
        let val = newVal < 10 ? '0' + newVal : newVal
        this.setData({
          _index: val
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    months: [
      '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
    ],
    year: 0,
    month: '',
    day: 0,
    _index: ''
  },

  attached: function () {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    this.setData({
      year: year,
      month: this.data.months[month],
      day: util.formatNumber(day)
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    add: function () {
      this.triggerEvent('add', {}, {})
    },
  }
})
