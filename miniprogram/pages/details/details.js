// miniprogram/pages/subject/subject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAnswer: false,
    content: null,
    md: '动态INCLUDE用jsp:include动作实现 <jsp:include page="included.jsp" flush="true" />它总是会检查所含文件中的变化，适合用于包含动态页面，并且可以带参数。@静态INCLUDE用include伪码实现,定不会检查所含文件的变化，适用于包含静态页面<%@ include file="included.htm" %> '
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      title:options.title.replace(/\？/g,'?').replace(/\￥/g,'&'),
      answer: options.answer.replace(/\？/g, '?').replace(/\￥/g, '&')
    })
  },

  seeAnswer: function () {
    console.log(this.data.content)
    this.setData({
      showAnswer: true
    });
  },
  hideAnswer: function () {
    this.setData({
      showAnswer: false
    });
  }
})