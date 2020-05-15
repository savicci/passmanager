import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {RegisterComponent} from "./components/auth/register/register.component";
import {LoginComponent} from "./components/auth/login/login.component";
import {VaultComponent} from "./components/vaults/vault/vault.component";


const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'vault', component: VaultComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
