import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialMenuesPage } from './historial-menues.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialMenuesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialMenuesPageRoutingModule {}
