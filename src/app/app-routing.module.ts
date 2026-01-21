import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then(m => m.PrincipalPageModule)
  },
  {
    path: 'organiseitor',
    loadChildren: () => import('./organiseitor/organiseitor.module').then(m => m.OrganiseitorPageModule)
  },
  {
    path: 'planificador',
    loadChildren: () => import('./planificador/planificador.module').then(m => m.PlanificadorPageModule)
  },
  {
    path: 'gastos-casa',
    loadChildren: () => import('./gastos-casa/gastos-casa.module').then(m => m.GastosCasaPageModule)
  },
  {
    path: 'balance-global',
    loadChildren: () => import('./balance-global/balance-global.module').then(m => m.BalanceGlobalPageModule)
  },
  {
    path: '',
    redirectTo: 'principal',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
