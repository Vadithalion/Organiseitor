import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialMenuesPageRoutingModule } from './historial-menues-routing.module';

import { HistorialMenuesPage } from './historial-menues.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialMenuesPageRoutingModule
  ],
  declarations: [HistorialMenuesPage]
})
export class HistorialMenuesPageModule {}
