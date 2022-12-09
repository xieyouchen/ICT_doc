// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
    // 云函数入口函数
exports.main = async(event, context) => {
    var open_id = event.open_id;
    console.log(open_id);
    return cloud.database().collection("USER").where({
        _openid: _.eq(open_id)
    }).get();
}