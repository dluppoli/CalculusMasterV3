import { Routes } from '@angular/router';
import { NumeriprimiComponent } from './numeriprimi/numeriprimi.component';
import { PigrecoComponent } from './pigreco/pigreco.component';
import { BackendComponent } from './backend/backend.component';
import { LoginComponent } from './login/login.component';
import { loginGuard } from './login.guard';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path:'login', canActivate:[loginGuard], component:LoginComponent},
    { path:'',  canActivate:[authGuard], component:BackendComponent, loadChildren: () => import('./backend/backend-routes').then(r => r.BackendRoutes)}
];
