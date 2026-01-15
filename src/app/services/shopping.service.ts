import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';
import { Purchase } from '../models/purchase.model';

@Injectable({
    providedIn: 'root'
})
export class ShoppingService {
    private readonly STORAGE_KEY_ITEMS = 'shopping_items';
    private readonly STORAGE_KEY_HISTORY = 'shopping_history';

    // Signals
    items = signal<Product[]>([]);
    history = signal<Purchase[]>([]);

    // Unique list of all product names ever purchased
    suggestedProducts = computed(() => {
        const names = new Set<string>();
        this.history().forEach(purchase => {
            purchase.items.forEach(item => {
                names.add(item.name);
            });
        });
        // Sort alphabetically
        return Array.from(names).sort();
    });

    constructor() {
        this.loadFromStorage();

        // Auto-save whenever signals change
        effect(() => {
            this.saveToStorage();
        });
    }

    private loadFromStorage() {
        const storedItems = localStorage.getItem(this.STORAGE_KEY_ITEMS);
        if (storedItems) {
            this.items.set(JSON.parse(storedItems));
        }

        const storedHistory = localStorage.getItem(this.STORAGE_KEY_HISTORY);
        if (storedHistory) {
            this.history.set(JSON.parse(storedHistory));
        }
    }

    private saveToStorage() {
        localStorage.setItem(this.STORAGE_KEY_ITEMS, JSON.stringify(this.items()));
        localStorage.setItem(this.STORAGE_KEY_HISTORY, JSON.stringify(this.history()));
    }

    addProduct(name: string, quantity: number, price: number = 0, weight: number = 0) {
        const newItem: Product = {
            id: crypto.randomUUID(),
            name,
            quantity,
            price,
            weight,
            completed: false
        };
        this.items.update(items => [...items, newItem]);
    }

    removeProduct(id: string) {
        this.items.update(items => items.filter(item => item.id !== id));
    }

    removeProducts(ids: string[]) {
        this.items.update(items => items.filter(item => !ids.includes(item.id)));
    }

    toggleCompletion(id: string) {
        this.items.update(items =>
            items.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
        );
    }

    incrementProductQuantity(id: string, amount: number) {
        this.items.update(items =>
            items.map(item => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
        );
    }

    checkout(selectedIds: string[]) {
        const currentItems = this.items();
        const purchaseItems = currentItems.filter(item => selectedIds.includes(item.id));

        if (purchaseItems.length === 0) return;

        const purchase: Purchase = {
            id: crypto.randomUUID(),
            date: new Date(),
            items: purchaseItems,
            total: purchaseItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0)
        };

        // Add to history
        this.history.update(history => [purchase, ...history]);

        // Remove bought items from current list
        this.items.update(items => items.filter(item => !selectedIds.includes(item.id)));
    }

    clearHistory() {
        this.history.set([]);
    }

    clearItems() {
        this.items.set([]);
    }

    updateHistoryItem(purchaseId: string, itemId: string, newPrice: number, newWeight: number, newQuantity: number) {
        this.history.update(history =>
            history.map(purchase => {
                if (purchase.id === purchaseId) {
                    const updatedItems = purchase.items.map(item =>
                        item.id === itemId ? { ...item, price: newPrice, weight: newWeight, quantity: newQuantity } : item
                    );
                    const newTotal = updatedItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
                    return { ...purchase, items: updatedItems, total: newTotal };
                }
                return purchase;
            })
        );
    }

    removePurchases(purchaseIds: string[]) {
        this.history.update(history => history.filter(p => !purchaseIds.includes(p.id)));
    }
}
