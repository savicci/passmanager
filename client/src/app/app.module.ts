import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {AuthenticationService} from "./components/services/authentication.service";
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { PublicComponent } from './components/public/public.component';
import { PrivateComponent } from './components/private/private.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { VaultComponent } from './components/vaults/vault/vault.component';
import { VaultRowComponent } from './components/vaults/vault/vault-row/vault-row.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    PublicComponent,
    PrivateComponent,
    LogoutComponent,
    VaultComponent,
    VaultRowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
