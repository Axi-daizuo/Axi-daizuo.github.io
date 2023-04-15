//注册新用户处理函数
exports.regUser = (req, res) => {
  //获取客户端 提交服务器的信息
  const userinfo = req.body
  console.log(userinfo);
  res.sand('reguser ok')
}