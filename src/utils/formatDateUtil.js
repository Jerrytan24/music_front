/**
 * 毫秒转换友好的显示格式
 * 输出格式：1小时前
 * stringTime为:年-月-日 时:分:秒
 */
import './date.format.js'
function friendlyFormatTime(stringTime) {
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    let month = day * 30;
    //当前的时间戳
    let time1 = new Date().getTime();
    //指定时间的时间戳
    let time2 = Date.parse(new Date(stringTime));
    let time = time1 - time2;
    let result = null;
    if (time < 0) {
        result = "--";
    } else if (time / month >= 1) {
        result = new Date(stringTime).format("Y-m-d H:i");
    } else if (time / week >= 1) {
        result = parseInt(time / week) + "周前";
    } else if (time / day >= 1) {
        result = parseInt(time / day) + "天前";
    } else if (time / hour >= 1) {
        result = parseInt(time / hour) + "小时前";
    } else if (time / minute >= 1) {
        result = parseInt(time / minute) + "分钟前";
    } else {
        result = "刚刚";
    }
    return result;
}

export {
    friendlyFormatTime
};