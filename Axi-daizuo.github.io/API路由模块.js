const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'chaizhongxi1234',
  database: 'yy',
});
//发布论坛
router.post('/postmoment', (req, res) => {
  const { user_id, content, images, location } = req.body;
  const sql = `INSERT INTO moment (user_id, content, images, location) 
               VALUES (${user_id}, '${content}', '${images}', '${location}')`;
  pool.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 500, msg: '服务器错误' });
    }
    const momentId = result.insertId;
    return res.status(200).json({ status: 200, data: { momentId } });
  });
});


router.post('/postuser', (req, res) => {
  const { username, password, gender, age, region, avatar, zodiac, nickname, occupation } = req.body;
  const sql = `INSERT INTO user (username, password, gender, age, region, avatar, zodiac, nickname, occupation) 
               VALUES ('${username}', '${password}', '${gender}', ${age}, '${region}', '${avatar}', '${zodiac}', '${nickname}', '${occupation}')`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 500, msg: '服务器错误' });
    }
    const userId = result.insertId;
    const token = jwt.sign({ userId }, 'my_secret_key', { expiresIn: '10h' });
    return res.status(200).json({ status: 200, data: { userId, token } });
  });
});


router.get('/login', (req, res) => {
  const { username, password } = req.query;
  const sql = `SELECT * FROM user WHERE username='${username}' AND password='${password}'`;
  pool.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 500, msg: '服务器错误' });
    }
    if (result.length === 0) {
      return res.status(401).json({ status: 401, msg: '用户名或密码错误' });
    }
    // 生成token，有效期为10小时
    const token = jwt.sign({ userId: result[0].id }, 'my_secret_key', { expiresIn: '10h' });

    return res.status(200).json({ status: 200, data: { token, userId: result[0].id } });
  });
});

//查询 指定id 用户信息--------------------------
router.get('/userid', (req, res) => {
  const { id } = req.query;
  const checkSql = `SELECT * FROM user WHERE id=${id}`;
  pool.query(checkSql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 500, msg: '服务器错误' });
    }
    return res.status(200).json({ status: 200, data: result });
  });
});

//查询用户信息------------------------------------------------------------
router.get('/user', (req, res) => {
  const checkSql = 'SELECT * FROM user';
  pool.query(checkSql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 500, msg: '服务器错误' });
    }
    return res.status(200).json({ status: 200, data: result });
  });
});

//查询论坛广场------------------------------------------------------------

router.get('/forum', (req, res) => { //用户 ID、用户头像 URL、用户昵称、动态内容、动态图片 URL（如果有）、动态地点（如果有）
  const checkSql = `SELECT user.id, user.avatar, user.nickname, moment.content, moment.images, moment.location 
                    FROM user 
                    JOIN moment ON user.id = moment.user_id`;
  pool.query(checkSql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 500, msg: '服务器错误' });
    }
    return res.status(200).json({ status: 200, data: result });
  });
});

router.use(cors()); // 在路由对象上使用 cors 中间件
module.exports = router;

// //登录用户------------------------------------------------------------
// // 处理登录用户的路由
// router.get('/login', (req, res) => {
//   const { usename, password } = req.query;
//   // 判断用户名和密码是否为空
//   if (!usename || !password) {
//     return res.status(400).json({ status: '用户名和密码不能为空' });
//   }
//   // 查询数据库中是否存在该用户名和密码
//   const checkSql = 'SELECT * FROM ev_users WHERE usename = ? AND password = ?';
//   pool.query(checkSql, [usename, password], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ status: 500, msg: '服务器错误' });
//     }
//     // 如果不存在该用户或密码不正确，返回错误提示
//     if (result.length === 0) {
//       return res.status(400).json({ status: 400, msg: '用户名或密码不正确' });
//     }
//     // 如果存在该用户且密码正确，返回登录成功的信息
//     return res.status(200).json({ status: 200, msg: '登录成功' });
//   });
// });



// //注册用户------------------------------------------------------------
// // 处理添加用户的路由
// router.post('/register', (req, res) => {
//   const { usename, password } = req.body;
//   // 判断用户名和密码是否为空
//   if (!usename || !password) {
//     return res.status(400).json({ status: '用户名和密码不能为空' });
//   }
//   // 查询数据库中是否已存在该用户名
//   const checkSql = 'SELECT * FROM ev_users WHERE usename = ?';
//   pool.query(checkSql, [usename], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ status:500,msg: '服务器错误' });
//     }
//     // 如果已存在该用户名，返回错误提示
//     if (result.length > 0) {
//       return res.status(400).json({ status: 400,msg:'该用户名已存在' });
//     }
//     // 如果不存在该用户名，将用户信息插入数据库中
//     const insertSql = 'INSERT INTO ev_users (usename, password) VALUES (?, ?)';
//     pool.query(insertSql, [usename, password], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ status:500,msg: '服务器错误' });
//       }
//       // 返回添加用户成功的信息
//       return res.status(200).json({ status: 200, msg: '添加用户成功' });
//     });
//   });
// });


// // 处理删除用户-----------------------------------------------------------
// router.get('/delete', (req, res) => {
//   const userId = req.query.id;
//   // 构建 SQL 查询语句，根据用户 ID 删除用户
//   const deleteSql = 'DELETE FROM ev_users WHERE id = ?';
//   pool.query(deleteSql, [userId], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ status: 500, msg: '服务器错误' });
//     }
//     // 判断是否成功删除了用户，如果影响行数为 0，说明没有删除任何用户，返回错误提示
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ status: 404, msg: '未找到该用户' });
//     }
//     // 返回成功删除用户的信息
//     return res.status(200).json({ status: 200, msg: '删除用户成功' });
//   });
// });


// // 处理更新用户信息的路由----------------------------------------------------------
// router.post('/update', (req, res) => {
//   const { id, password, nickname, email, ev_userscol, user_pic } = req.body;
//   // 构建 UPDATE 语句，更新数据库中对应用户的信息
//   const updateSql = 'UPDATE ev_users SET password = ?, nickname = ?, email = ?, ev_userscol = ?, user_pic = ? WHERE id = ?';
//   pool.query(updateSql, [password, nickname, email, ev_userscol, user_pic, id], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ status: 500, msg: '服务器错误' });
//     }
//     // 判断是否成功更新了用户信息，如果影响行数为 0，说明没有更新任何用户信息，返回错误提示
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ status: 404, msg: '未找到该用户' });
//     }
//     // 返回成功更新用户信息的信息
//     return res.status(200).json({ status: 200, msg: '更新用户信息成功' });
//   });
// });

// 导出路由
