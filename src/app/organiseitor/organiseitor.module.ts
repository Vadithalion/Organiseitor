import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrganiseitorPageRoutingModule } from './organiseitor-routing.module';

import { OrganiseitorPage } from './organiseitor.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OrganiseitorPageRoutingModule
  ],
  declarations: [OrganiseitorPage]
})
export class OrganiseitorPageModule { }
