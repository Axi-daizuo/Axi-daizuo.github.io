const express = require('express');
const app = express();
const apiRouter = require('./API路由模块.js');
const apiimages = require('./images.js');
const bodyParser = require('body-parser');

const fileUpload = require('express-fileupload');

// 引入 CORS 中间件并使用
const cors = require('cors');
app.use(cors());

// 配置 bodyParser 中间件，用于解析 post 请求传来的数据
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 配置文件上传中间件
app.use(fileUpload());
const path = require('path');

// 使用路由中间件
app.use('/api', apiRouter);
app.use('/images', apiimages);

app.listen(3000, () => {
  console.log('Server is running at http://127.0.0.1:3000/');
});
