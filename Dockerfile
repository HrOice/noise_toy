# 使用官方 Node.js 镜像作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件到容器中
COPY . .

# 构建 React 应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动服务器
CMD ["node", "server.js"]