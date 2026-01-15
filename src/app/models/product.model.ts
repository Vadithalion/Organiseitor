export interface Product {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  weight?: number;
  completed: boolean;
}
