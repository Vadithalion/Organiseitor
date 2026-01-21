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

    get greeting(): string {
        const hour = new Date().getHours();
        if (hour < 12) return '¡Buenos días!';
        if (hour < 20) return '¡Buenas tardes!';
        return '¡Buenas noches!';
    }

    async openSettings() {
        const modal = await this.modalCtrl.create({
            component: SettingsModalComponent,
            cssClass: 'settings-modal',
            initialBreakpoint: 0.5,
            breakpoints: [0, 0.5, 0.75],
            handle: true
        });
        return await modal.present();
    }
}
