import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component";
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/auth/login/login.component";
import {RegisterComponent} from "./components/auth/register/register.component";
import {PublicComponent} from "./components/public/public.component";
import {PrivateComponent} from "./components/private/private.component";
import {LogoutComponent} from "./components/auth/logout/logout.component";
import {VaultComponent} from "./components/vaults/vault/vault.component";


const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'public', component: PublicComponent},
  {path: 'private', component: PrivateComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'vault', component: VaultComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
