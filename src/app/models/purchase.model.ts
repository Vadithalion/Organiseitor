import { Product } from './product.model';

export interface Purchase {
    id: string;
    date: Date;
    items: Product[];
    total: number;
}
