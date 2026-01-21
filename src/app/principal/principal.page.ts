import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { SettingsModalComponent } from './settings-modal.component';
import { ThemeService, AppTheme } from '../services/theme.service';

@Component({
    selector: 'app-principal',
    templateUrl: 'principal.page.html',
    styleUrls: ['principal.page.scss'],
    standalone: false
})
export class PrincipalPage implements OnInit {
    currentTheme: AppTheme = 'light';

    constructor(
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private themeService: ThemeService
    ) { }

    ngOnInit() {
        this.themeService.theme$.subscribe(theme => {
            this.currentTheme = theme;
        });
    }

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
            initialBreakpoint: 0.75,
            breakpoints: [0, 0.75, 1],
            handle: true
        });
        return await modal.present();
    }
}
