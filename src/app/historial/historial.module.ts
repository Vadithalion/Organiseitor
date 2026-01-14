import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialPage } from './historial.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { HistorialPageRoutingModule } from './historial-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HistorialPageRoutingModule
  ],
  declarations: [HistorialPage]
})
export class HistorialPageModule { }
