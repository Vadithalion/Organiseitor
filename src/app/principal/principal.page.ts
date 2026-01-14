import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsModalComponent } from './settings-modal.component';

@Component({
    selector: 'app-principal',
    templateUrl: 'principal.page.html',
    styleUrls: ['principal.page.scss'],
    standalone: false
})
export class PrincipalPage {
    constructor(private modalCtrl: ModalController) { }

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
