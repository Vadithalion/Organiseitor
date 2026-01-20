import { Injectable, signal, effect, computed } from '@angular/core';
import { Gasto } from '../models/gasto.model';
import { ShoppingService } from './shopping.service';

@Injectable({
    providedIn: 'root'
})
export class GastosService {
    private readonly STORAGE_KEY_GASTOS = 'house_gastos';

    // Signal for manual expenses
    private manualGastos = signal<Gasto[]>([]);

    constructor(private shoppingService: ShoppingService) {
        this.loadFromStorage();

        effect(() => {
            this.saveToStorage();
        });
    }

    // Computed signal that combines manual expenses and shopping history
    allGastos = computed(() => {
        const historyGastos: Gasto[] = this.shoppingService.history().map(purchase => ({
            id: purchase.id,
            fecha: new Date(purchase.date),
            descripcion: 'Compra Supermercado',
            categoria: 'Alimentación',
            cantidad: purchase.total
        }));

        return [...this.manualGastos(), ...historyGastos].sort((a, b) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
    });

    private loadFromStorage() {
        const stored = localStorage.getItem(this.STORAGE_KEY_GASTOS);
        if (stored) {
            const parsed = JSON.parse(stored);
            this.manualGastos.set(parsed.map((g: any) => ({ ...g, fecha: new Date(g.fecha) })));
        }
    }

    private saveToStorage() {
        localStorage.setItem(this.STORAGE_KEY_GASTOS, JSON.stringify(this.manualGastos()));
    }

    addGasto(descripcion: string, categoria: string, cantidad: number, fecha: Date = new Date()) {
        const nuevoGasto: Gasto = {
            id: crypto.randomUUID(),
            fecha,
            descripcion,
            categoria,
            cantidad
        };
        this.manualGastos.update(gastos => [nuevoGasto, ...gastos]);
    }

    removeGasto(id: string) {
        this.manualGastos.update(gastos => gastos.filter(g => g.id !== id));
    }
}
