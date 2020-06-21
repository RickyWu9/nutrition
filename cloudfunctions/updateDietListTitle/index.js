// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
// const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  try { 
    return await db.collection('dietList').where({
      _openid: wxContext.OPENID,
      title: event.oldTitle
    })
    .update({
      data: {
        title: event.newTitle
      },
    })
  } catch(e) {
    console.error(e)
  }
}