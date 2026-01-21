import { Component, computed } from '@angular/core';
import { GastosService } from '../services/gastos.service';

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

    constructor(public gastosService: GastosService) { }

}
