import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaPage } from './lista.page';

import { ListaPageRoutingModule } from './lista-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ListaPageRoutingModule
  ],
  declarations: [ListaPage]
})
export class ListaPageModule { }
