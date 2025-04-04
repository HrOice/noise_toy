import { Plant } from '../types';

const STORAGE_KEY = 'quiet_garden_data';

export interface StorageData {
  plants: Plant[];
  settings: {
    maxSeconds: number;
    maxDecibel: number;
    alertThreshold: number;
    seedlingsToTree: number;  // 新增：多少个树苗变成树
    treesToFlower: number;    // 新增：多少棵树变成花
  };
}

export const defaultSettings: StorageData['settings'] = {
  maxSeconds: 5,
  maxDecibel: 20,
  alertThreshold: 15,
  seedlingsToTree: 5,     // 默认5个树苗变成一棵树
  treesToFlower: 5        // 默认5棵树变成一朵花
};

export const storageService = {
  getData: (): StorageData => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { plants: [], settings: defaultSettings };
    }
    return JSON.parse(data);
  },

  saveData: (data: StorageData): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  resetData: (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plants: [], settings: defaultSettings }));
  },
};