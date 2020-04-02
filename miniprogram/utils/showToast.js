const show_toast = title => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  })
}

module.exports = {
  show_toast: show_toast
}