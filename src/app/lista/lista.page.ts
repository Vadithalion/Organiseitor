import { Component, computed, signal } from '@angular/core';
import { ShoppingService } from '../services/shopping.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lista',
  templateUrl: 'lista.page.html',
  styleUrls: ['lista.page.scss'],
  standalone: false,
})
export class ListaPage {
  newItemName = '';
  newItemQuantity: number | null = null;
  newItemPrice: number | null = null;

  selectedItems = signal<string[]>([]);

  constructor(
    public shoppingService: ShoppingService,
    private alertCtrl: AlertController
  ) { }

  async addItem() {
    if (!this.newItemName.trim()) {
      return;
    }

    const name = this.newItemName.trim();
    const quantity = this.newItemQuantity || 1;
    const price = this.newItemPrice || 0;

    await this.checkExistenceAndAdd(name, quantity, price);

    this.newItemName = '';
    this.newItemQuantity = null;
    this.newItemPrice = null;
  }

  async addSuggestedProduct(name: string) {
    await this.checkExistenceAndAdd(name, 1, 0);
  }

  private async checkExistenceAndAdd(name: string, quantity: number, price: number) {
    const existingProduct = this.shoppingService.items().find(
      p => p.name.toLowerCase() === name.toLowerCase()
    );

    if (existingProduct) {
      const alert = await this.alertCtrl.create({
        header: 'Producto duplicado',
        message: `"${name}" ya está en tu lista. ¿Quieres añadir uno más a la cantidad actual?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Añadir 1',
            handler: () => {
              this.shoppingService.incrementProductQuantity(existingProduct.id, 1);
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.shoppingService.addProduct(name, quantity, price);
    }
  }

  toggleSelection(itemId: string) {
    this.selectedItems.update(selected => {
      if (selected.includes(itemId)) {
        return selected.filter(id => id !== itemId);
      } else {
        return [...selected, itemId];
      }
    });
  }

  async deleteItem(itemId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Borrar Producto',
      message: '¿Quieres eliminar este producto de la lista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: () => {
            this.shoppingService.removeProduct(itemId);
            // Also remove from selection if present
            this.selectedItems.update(selected => selected.filter(id => id !== itemId));
          }
        }
      ]
    });
    await alert.present();
  }

  async checkout() {
    const selected = this.selectedItems();
    if (selected.length === 0) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar Compra',
      message: `¿Finalizar compra de ${selected.length} producto(s)?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Comprar',
          handler: () => {
            this.shoppingService.checkout(selected);
            this.selectedItems.set([]);
          }
        }
      ]
    });
    await alert.present();
  }

  async clearList() {
    const alert = await this.alertCtrl.create({
      header: 'Vaciar Lista',
      message: '¿Estás seguro de que quieres borrar TODOS los productos de la lista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Vaciar',
          role: 'destructive',
          handler: () => {
            this.shoppingService.clearItems();
            this.selectedItems.set([]);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteSelected() {
    const selected = this.selectedItems();
    if (selected.length === 0) return;

    const alert = await this.alertCtrl.create({
      header: 'Borrar Seleccionados',
      message: `¿Borrar los ${selected.length} productos seleccionados?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          role: 'destructive',
          handler: () => {
            this.shoppingService.removeProducts(selected);
            this.selectedItems.set([]);
          }
        }
      ]
    });
    await alert.present();
  }
}
