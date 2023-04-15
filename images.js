const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const router = express.Router();

// 创建 Express 应用程序
const app = express();

// 引入 CORS 中间件并使用
const cors = require('cors');
app.use(cors());
const path = require('path');

// 配置静态文件目录
app.use(express.static(path.join(__dirname, 'uploads')));

// 配置文件上传中间件
app.use(fileUpload());// 处理文件上传请求
router.post('/upload', (req, res) => {
    // 如果没有上传文件，则返回错误
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // 获取上传的文件数组
    const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    // 创建空数组保存已上传文件信息
    const uploadedFiles = [];
    // 遍历上传的文件数组并逐个处理
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // 获取上传文件的类型和构造文件保存的路径和名称
        const fileType = file.mimetype;
        let fileName = Date.now() + '-' + i + '.' + fileType.split('/')[1];
        let filePath = path.join(__dirname, 'uploads', fileName);
        // 检查上传的文件是否已经存在，如果存在则给文件名添加后缀
        if (fs.existsSync(filePath)) {
            let suffix = 1;
            while (fs.existsSync(filePath)) {
                fileName = Date.now() + '-' + i + '-' + suffix + '.' + fileType.split('/')[1];
                filePath = path.join(__dirname, 'uploads', fileName);
                suffix++;
            }
        }
        // 将上传的文件保存到服务器上的 uploads 目录中
        file.mv(filePath, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            // 将已上传文件信息保存到 uploadedFiles 数组中
            uploadedFiles.push({
                fileName: fileName,
                fileType: fileType,
                url: '/uploads/' + fileName // 将文件路径转为相对路径，以便在前端进行展示
            });
            // 如果已上传文件数量与文件数组长度相等，则说明全部文件上传成功，返回上传成功的消息
            if (uploadedFiles.length === files.length) {
                res.send({
                    message: '上传成功',
                    files: uploadedFiles,
                });
            }
        });
    }
});

module.exports = router;