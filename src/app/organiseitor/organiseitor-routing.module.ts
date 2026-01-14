import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganiseitorPage } from './organiseitor.page';

const routes: Routes = [
  {
    path: '',
    component: OrganiseitorPage,
    children: [
      {
        path: 'lista',
        loadChildren: () => import('../lista/lista.module').then(m => m.ListaPageModule)
      },
      {
        path: 'historial',
        loadChildren: () => import('../historial/historial.module').then(m => m.HistorialPageModule)
      },
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganiseitorPageRoutingModule { }
