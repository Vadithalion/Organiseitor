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

  // Edit Modal State
  isEditModalOpen = false;
  editingPurchaseId = '';
  editingItemId = '';
  editPrice = 0;
  editWeight = 0;
  editQuantity = 0;
  editingItemName = '';

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

  openEditModal(purchaseId: string, item: any) {
    this.editingPurchaseId = purchaseId;
    this.editingItemId = item.id;
    this.editingItemName = item.name;
    this.editPrice = item.price || 0;
    this.editWeight = item.weight || 0;
    this.editQuantity = item.quantity;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  saveEdit() {
    if (this.editingPurchaseId && this.editingItemId) {
      this.shoppingService.updateHistoryItem(
        this.editingPurchaseId,
        this.editingItemId,
        this.editPrice,
        this.editWeight,
        this.editQuantity
      );
    }
    this.closeEditModal();
  }

  toggleFavorite(event: Event, name: string) {
    event.stopPropagation();
    const isCurrentlyFavorite = this.shoppingService.favoriteProductNames().includes(name);
    this.shoppingService.updateGlobalFavorite(name, !isCurrentlyFavorite);
  }
}
