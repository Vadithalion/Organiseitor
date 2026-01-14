import { Component } from '@angular/core';
import { ShoppingService } from '../services/shopping.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-historial',
  templateUrl: 'historial.page.html',
  styleUrls: ['historial.page.scss'],
  standalone: false,
})
export class HistorialPage {

  constructor(
    public shoppingService: ShoppingService,
    private alertCtrl: AlertController
  ) { }

  isSelectionMode = false;
  selectedPurchaseIds: string[] = [];

  toggleSelectionMode() {
    this.isSelectionMode = !this.isSelectionMode;
    this.selectedPurchaseIds = [];
  }

  togglePurchaseSelection(purchaseId: string) {
    if (this.selectedPurchaseIds.includes(purchaseId)) {
      this.selectedPurchaseIds = this.selectedPurchaseIds.filter(id => id !== purchaseId);
    } else {
      this.selectedPurchaseIds.push(purchaseId);
    }
  }

  async deleteSelected() {
    if (this.selectedPurchaseIds.length === 0) {
      this.toggleSelectionMode();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirmar Borrado',
      message: `¿Borrar ${this.selectedPurchaseIds.length} compra(s) seleccionada(s)?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: () => {
            this.shoppingService.removePurchases(this.selectedPurchaseIds);
            this.toggleSelectionMode();
          }
        }
      ]
    });
    await alert.present();
  }

  async editPrice(purchaseId: string, itemId: string, currentPrice: number) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Precio',
      inputs: [
        {
          name: 'price',
          type: 'number',
          placeholder: 'Precio',
          value: currentPrice,
          attributes: {
            step: '0.01'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const priceStr = data.price ? data.price.toString().replace(',', '.') : '0';
            const newPrice = parseFloat(priceStr);
            if (!isNaN(newPrice)) {
              this.shoppingService.updateHistoryItemPrice(purchaseId, itemId, newPrice);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
