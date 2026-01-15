import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanificadorPage } from './planificador.page';

const routes: Routes = [
  {
    path: '',
    component: PlanificadorPage
  },  {
    path: 'historial-menues',
    loadChildren: () => import('./historial-menues/historial-menues.module').then( m => m.HistorialMenuesPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificadorPageRoutingModule {}
