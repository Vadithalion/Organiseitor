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
    path: '',
    redirectTo: 'principal',
    pathMatch: 'full'
  },
  {
    path: 'planificador',
    loadChildren: () => import('./planificador/planificador.module').then( m => m.PlanificadorPageModule)
  },  {
    path: 'gastos-casa',
    loadChildren: () => import('./gastos-casa/gastos-casa.module').then( m => m.GastosCasaPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
