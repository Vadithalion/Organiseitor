import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanificadorPageRoutingModule } from './planificador-routing.module';

import { PlanificadorPage } from './planificador.page';

import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificadorPageRoutingModule,
    DragDropModule
  ],
  declarations: [PlanificadorPage]
})
export class PlanificadorPageModule { }
