# React Noise Monitor

这是一个使用 React 构建的网页应用程序，旨在监测当前声音的分贝水平并提供相应的视觉反馈。

## 功能

- **分贝进度条**：显示当前音频水平的进度条，最大值为 50 分贝。
- **倒计时**：在特定条件下进行倒计时。
- **花园展示**：根据音频水平条件动态展示小花、小树苗和小树。
- **警告提示**：当分贝水平超过 50 时，发出警告并重新计时。

## 目录结构

```
react-noise-monitor
├── src
│   ├── components          # 组件目录
│   ├── hooks               # 自定义 Hook
│   ├── utils               # 工具函数
│   ├── App.tsx             # 主应用组件
│   ├── index.tsx           # 应用入口
│   └── types.ts            # TypeScript 类型定义
├── public
│   └── index.html          # HTML 入口文件
├── package.json            # npm 配置文件
├── tsconfig.json           # TypeScript 配置文件
└── README.md               # 项目说明文件
```

## 安装与运行

1. 克隆项目：
   ```bash
   git clone <repository-url>
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动应用：
   ```bash
   npm start
   ```

## 许可证

此项目遵循 MIT 许可证。