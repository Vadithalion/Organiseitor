import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BalanceGlobalPageRoutingModule } from './balance-global-routing.module';
import { BalanceGlobalPage } from './balance-global.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BalanceGlobalPageRoutingModule
    ],
    declarations: [BalanceGlobalPage]
})
export class BalanceGlobalPageModule { }
