// 返回yyyy-mm-dd HH:mm:ss
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 返回YYYY-MM-DD
const formatDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

// 返回HH:mm类型
const format = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
} 

// 将x变成0x
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 计算yyyy-mm-dd HH:mm:ss的时间差
// 返回分钟数
const duration = (start,end) => {
  return (parserDate(end).getTime() - parserDate(start).getTime()) / 1000 / 60
}

// 将yyyy-mm-dd HH:mm:ss换成日期类型
const parserDate = date => {
  var t = Date.parse(date);
  if (!isNaN(t)) {
    return new Date(Date.parse(date.replace(/-/g, "/")));
  } else {
    return new Date();
  }
}


module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  formatDay: formatDay,
  duration: duration,
  format: format,
  parserDate: parserDate
}
