const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 指定静态文件目录
app.use(express.static(path.join(__dirname, 'build')));

// 所有未匹配的路由都返回 index.html
app.get('/', (req, res, next) => {
    const filePath = path.join(__dirname, 'build', 'index.html');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  });

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});