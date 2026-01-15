import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { SettingsModalComponent } from './settings-modal.component';

@Component({
    selector: 'app-principal',
    templateUrl: 'principal.page.html',
    styleUrls: ['principal.page.scss'],
    standalone: false
})
export class PrincipalPage {
    constructor(
        private modalCtrl: ModalController,
        private toastCtrl: ToastController
    ) { }

    async showComingSoon() {
        const toast = await this.toastCtrl.create({
            message: 'Esta función estará disponible próximamente 🚀',
            duration: 2000,
            position: 'bottom',
            color: 'secondary',
            cssClass: 'custom-toast'
        });
        await toast.present();
    }

    async openSettings() {
        const modal = await this.modalCtrl.create({
            component: SettingsModalComponent,
            initialBreakpoint: 0.5,
            breakpoints: [0, 0.5, 0.75],
            handle: true
        });
        return await modal.present();
    }
}
