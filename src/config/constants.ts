export const CONFIG = {
  // 计时相关
  TIMER: {
    MAX_SECONDS: 5,      // 计时器最大秒数
    UPDATE_INTERVAL: 1000  // 更新间隔（毫秒）
  },
  
  // 音量相关
  NOISE: {
    MAX_DECIBEL: 20,      // 最大分贝值
    ALERT_THRESHOLD: 15    // 警告阈值
  },
  
  // 植物相关
  PLANTS: {
    SEEDLINGS_TO_TREE: 2,  // 多少个树苗变成一棵树
    TREES_TO_FLOWER: 2     // 多少棵树变成一朵花
  }
};

// 添加类型导出
export type ConfigType = typeof CONFIG;