const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const dateParse = (date, input, h24 = true) => {
  if (!date) {
    return;
  }
  if (typeof date === "string") {
    date = new Date(date.replace(/-/g, "/"));
  } else if (typeof date === "number") {
    date = new Date(date);
  }
  input = input || "yyyy-MM-dd HH:mm:ss";
  const format = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": h24 ? date.getHours() : date.getHours() % 12, // 小时
    "H+": h24 ? date.getHours() : date.getHours() % 12, // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  const week = {
    0: "7",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
  };
  if (/(y+)/.test(input)) {
    input = input.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }
  if (/(E+)/.test(input)) {
    input = input.replace(RegExp.$1, week[`${date.getDay()}`]);
  }
  for (const k in format) {
    if (new RegExp(`(${k})`).test(input)) {
      input = input.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? format[k]
          : `00${format[k]}`.substr(`${format[k]}`.length)
      );
    }
  }
  return input;
};

const formatSeconds = (seconds) => {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;

  // 添加前导零
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;
  }

  return minutes + ":" + remainingSeconds;
}

module.exports = {
  formatTime,
  dateParse,
  formatSeconds
}
