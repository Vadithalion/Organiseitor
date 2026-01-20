import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GastosCasaPage } from './gastos-casa.page';

const routes: Routes = [
  {
    path: '',
    component: GastosCasaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GastosCasaPageRoutingModule {}
