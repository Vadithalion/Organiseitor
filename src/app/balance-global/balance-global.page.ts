import { Component, computed } from '@angular/core';
import { GastosService } from '../services/gastos.service';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-balance-global',
    templateUrl: './balance-global.page.html',
    styleUrls: ['./balance-global.page.scss'],
    standalone: false
})
export class BalanceGlobalPage {

    balance = computed(() => {
        const movements = this.gastosService.allMovimientos();
        const totalGastos = movements
            .filter(m => m.tipo === 'gasto')
            .reduce((acc, m) => acc + m.cantidad, 0);
        const totalIngresos = movements
            .filter(m => m.tipo === 'ingreso')
            .reduce((acc, m) => acc + m.cantidad, 0);

        return {
            total: totalIngresos - totalGastos,
            gastos: totalGastos,
            ingresos: totalIngresos,
            movements: movements.slice(0, 10) // Show last 10 movements
        };
    });

    constructor(
        public gastosService: GastosService,
        private alertCtrl: AlertController
    ) { }

    async showInfo() {
        const alert = await this.alertCtrl.create({
            header: 'Balance Global',
            message: 'Tu salud financiera en un solo lugar. Aquí se suman tus ingresos y se restan todos los gastos, incluyendo los tickets de la compra y los gastos de casa, para darte un balance neto real.',
            buttons: ['Entendido'],
            cssClass: 'custom-info-alert'
        });
        await alert.present();
    }
}
