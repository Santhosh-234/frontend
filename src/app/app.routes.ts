import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './base-layout/login/login.component';
import { BaseComponent } from './layout/base/base.component';
import { HomeComponent } from './pages/home/home.component';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: BaseComponent, canActivate: [MsalGuard], children: [
    { path: '', component: HomeComponent }
  ]},
  { path: '**', redirectTo: '' }
];
