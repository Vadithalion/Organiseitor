export interface Movimiento {
    id: string;
    fecha: Date;
    descripcion: string;
    categoria: string;
    cantidad: number;
    tipo: 'gasto' | 'ingreso';
}
