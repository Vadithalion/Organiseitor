import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';

@Component({
    selector: 'app-settings-modal',
    templateUrl: './settings-modal.component.html',
    styleUrls: ['./settings-modal.component.scss'],
    standalone: false
})
export class SettingsModalComponent implements OnInit {
    currentTheme: 'light' | 'dark' = 'light';

    constructor(
        private modalCtrl: ModalController,
        private themeService: ThemeService
    ) { }

    ngOnInit() {
        this.currentTheme = this.themeService.getTheme();
    }

    selectTheme(theme: 'light' | 'dark') {
        this.currentTheme = theme;
        this.themeService.setTheme(theme);
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }
}
