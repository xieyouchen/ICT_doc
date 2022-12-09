// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
    // 云函数入口函数
exports.main = async(event, context) => {
    var index1 = Number(event.index);
    console.log(typeof(index1));
    return cloud.database().collection("USER").where({
        index: _.neq(index1)
    }).get();
}