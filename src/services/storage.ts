import { Plant } from '../types';

const STORAGE_KEY = 'quiet_garden_data';

export interface StorageData {
  plants: Plant[];
  settings: {
    maxSeconds: number;
    maxDecibel: number;
    alertThreshold: number;
    treesToFlower: number;
    seedlingsToTree: number;
  };
}

export const defaultSettings: StorageData['settings'] = {
  maxSeconds: 5,
  maxDecibel: 20,
  alertThreshold: 15,
  treesToFlower: 2,
seedlingsToTree: 2,
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