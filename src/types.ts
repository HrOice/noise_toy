export type Plant = {
    id: string;
    type: 'seedling' | 'tree' | 'flower';
  };
  
  export type AlertType = {
    show: boolean;
    message: string;
  };