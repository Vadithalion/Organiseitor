import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';
import { Purchase } from '../models/purchase.model';

@Injectable({
    providedIn: 'root'
})
export class ShoppingService {
    private readonly STORAGE_KEY_ITEMS = 'shopping_items';
    private readonly STORAGE_KEY_HISTORY = 'shopping_history';
    private readonly STORAGE_KEY_FAVORITES = 'shopping_favorites';

    // Signals
    items = signal<Product[]>([]);
    history = signal<Purchase[]>([]);
    favoriteProductNames = signal<string[]>([]);

    // List of products with details from history, favorites first
    suggestedProducts = computed(() => {
        const productMap = new Map<string, {
            name: string;
            price: number;
            weight: number;
            quantity: number;
            isFavorite: boolean;
        }>();
        const favorites = this.favoriteProductNames();

        this.history().forEach(purchase => {
            purchase.items.forEach(item => {
                const nameKey = item.name.toLowerCase();
                if (!productMap.has(nameKey)) {
                    productMap.set(nameKey, {
                        name: item.name,
                        price: item.price || 0,
                        weight: item.weight || 0,
                        quantity: item.quantity || 1,
                        isFavorite: favorites.includes(item.name)
                    });
                }
            });
        });

        // Convert map values to array
        let products = Array.from(productMap.values());

        // Sort: Favorites first, then alphabetical
        return products.sort((a, b) => {
            const aFav = a.isFavorite ? 1 : 0;
            const bFav = b.isFavorite ? 1 : 0;
            if (aFav !== bFav) return bFav - aFav;
            return a.name.localeCompare(b.name);
        });
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

        const storedFavorites = localStorage.getItem(this.STORAGE_KEY_FAVORITES);
        if (storedFavorites) {
            this.favoriteProductNames.set(JSON.parse(storedFavorites));
        }
    }

    private saveToStorage() {
        localStorage.setItem(this.STORAGE_KEY_ITEMS, JSON.stringify(this.items()));
        localStorage.setItem(this.STORAGE_KEY_HISTORY, JSON.stringify(this.history()));
        localStorage.setItem(this.STORAGE_KEY_FAVORITES, JSON.stringify(this.favoriteProductNames()));
    }

    addProduct(name: string, quantity: number, price: number = 0, weight: number = 0, isFavorite: boolean = false) {
        const newItem: Product = {
            id: crypto.randomUUID(),
            name,
            quantity,
            price,
            weight,
            completed: false,
            isFavorite: isFavorite || this.favoriteProductNames().includes(name)
        };
        this.items.update(items => [...items, newItem]);
        if (isFavorite) {
            this.updateGlobalFavorite(name, true);
        }
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

    updateProduct(id: string, newPrice: number, newWeight: number, newQuantity: number) {
        this.items.update(items =>
            items.map(item =>
                item.id === id ? { ...item, price: newPrice, weight: newWeight, quantity: newQuantity } : item
            )
        );
    }

    removePurchases(purchaseIds: string[]) {
        this.history.update(history => history.filter(p => !purchaseIds.includes(p.id)));
    }

    toggleFavorite(id: string) {
        this.items.update(items =>
            items.map(item => {
                if (item.id === id) {
                    const newStatus = !item.isFavorite;
                    this.updateGlobalFavorite(item.name, newStatus);
                    return { ...item, isFavorite: newStatus };
                }
                return item;
            })
        );
    }

    updateGlobalFavorite(name: string, status: boolean) {
        this.favoriteProductNames.update(prefs => {
            if (status) {
                if (!prefs.includes(name)) return [...prefs, name];
            } else {
                return prefs.filter(n => n !== name);
            }
            return prefs;
        });
    }
}
