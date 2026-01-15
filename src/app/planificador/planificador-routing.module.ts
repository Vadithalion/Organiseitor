import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanificadorPage } from './planificador.page';

const routes: Routes = [
  {
    path: '',
    component: PlanificadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificadorPageRoutingModule {}
