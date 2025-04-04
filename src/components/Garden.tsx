import React from 'react';
import { Plant } from '../types';

type GardenProps = {
  plants: Plant[];
};

export const Garden: React.FC<GardenProps> = ({ plants }) => {
  // 添加调试信息
//   console.log('Current plants:', {
//     total: plants.length,
//     seedlings: plants.filter(p => p.type === 'seedling').length,
//     trees: plants.filter(p => p.type === 'tree').length,
//     flowers: plants.filter(p => p.type === 'flower').length
//   });

  const getEmoji = (type: Plant['type']) => {
    switch (type) {
      case 'seedling':
        return '🌱';
      case 'tree':
        return '🌲';
      case 'flower':
        return '🌸';
    }
  };

  return (
    <div className="garden">
      {plants.map((plant) => (
        <span key={plant.id} className="plant">
          {getEmoji(plant.type)}
        </span>
      ))}
    </div>
  );
};