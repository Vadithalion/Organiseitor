import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GastosCasaPageRoutingModule } from './gastos-casa-routing.module';

import { GastosCasaPage } from './gastos-casa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GastosCasaPageRoutingModule
  ],
  declarations: [GastosCasaPage]
})
export class GastosCasaPageModule {}
