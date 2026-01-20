import { Injectable, signal, effect, computed } from '@angular/core';
import { Movimiento } from '../models/movimiento.model';
import { ShoppingService } from './shopping.service';

@Injectable({
    providedIn: 'root'
})
export class GastosService {
    private readonly STORAGE_KEY_MOVIMIENTOS = 'house_movimientos';

    // Signal for manual movements (expenses and income)
    private manualMovimientos = signal<Movimiento[]>([]);

    constructor(private shoppingService: ShoppingService) {
        this.loadFromStorage();

        effect(() => {
            this.saveToStorage();
        });
    }

    // Computed signal that combines manual movements and shopping history
    allMovimientos = computed(() => {
        const historyGastos: Movimiento[] = this.shoppingService.history().map(purchase => ({
            id: purchase.id,
            fecha: new Date(purchase.date),
            descripcion: 'Compra Supermercado',
            categoria: 'Alimentación',
            cantidad: purchase.total,
            tipo: 'gasto'
        }));

        return [...this.manualMovimientos(), ...historyGastos].sort((a, b) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
    });

    gastos = computed(() => this.allMovimientos().filter(m => m.tipo === 'gasto'));
    ingresos = computed(() => this.allMovimientos().filter(m => m.tipo === 'ingreso'));

    private loadFromStorage() {
        const stored = localStorage.getItem(this.STORAGE_KEY_MOVIMIENTOS);
        if (stored) {
            const parsed = JSON.parse(stored);
            this.manualMovimientos.set(parsed.map((m: any) => ({ ...m, fecha: new Date(m.fecha) })));
        } else {
            // Migración simple si existía la clave antigua de gastos
            const oldGastos = localStorage.getItem('house_gastos');
            if (oldGastos) {
                const parsed = JSON.parse(oldGastos);
                this.manualMovimientos.set(parsed.map((m: any) => ({
                    ...m,
                    fecha: new Date(m.fecha),
                    tipo: 'gasto'
                })));
                localStorage.removeItem('house_gastos');
            }
        }
    }

    private saveToStorage() {
        localStorage.setItem(this.STORAGE_KEY_MOVIMIENTOS, JSON.stringify(this.manualMovimientos()));
    }

    addMovimiento(descripcion: string, categoria: string, cantidad: number, tipo: 'gasto' | 'ingreso', fecha: Date = new Date()) {
        const nuevo: Movimiento = {
            id: crypto.randomUUID(),
            fecha,
            descripcion,
            categoria,
            cantidad,
            tipo
        };
        this.manualMovimientos.update(movs => [nuevo, ...movs]);
    }

    removeMovimiento(id: string) {
        this.manualMovimientos.update(movs => movs.filter(m => m.id !== id));
    }
}
