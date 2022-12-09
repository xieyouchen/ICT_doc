function optionEncode(str) {
    // 说明是没有处理过的字符串
    if (str === decodeURIComponent(str)) {
      return encodeURIComponent(str);
    }
    return str;
  }
  
function optionsToString(options = {}) {
    return Object.keys(options)
      .map((key) => `${key}=${optionEncode(options[key])}`)
      .join('&');
  }
  
  /**
   * 重定向页面到新页面
   * @param {*} path 
   * @param {*} options
   */
function redirect(path, options) {
    const url = `${path}?${optionsToString(options)}`;
    wx.redirectTo({
      url,
      fail() {
        wx.switchTab({
          url
        });
      }
    });
  }

Page({
    onLoad(options){
        redirect('/packageA/pages/detail/detail', options);
    }
});