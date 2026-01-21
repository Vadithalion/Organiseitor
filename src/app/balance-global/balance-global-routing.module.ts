import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BalanceGlobalPage } from './balance-global.page';

const routes: Routes = [
    {
        path: '',
        component: BalanceGlobalPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BalanceGlobalPageRoutingModule { }
