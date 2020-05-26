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
import { LogoutComponent } from './components/auth/logout/logout.component';
import { VaultComponent } from './components/vaults/vault/vault.component';
import { VaultRowComponent } from './components/vaults/vault/vault-row/vault-row.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from "./material.module";
import {PublicNavbarComponent} from "./components/navbar/public-navbar/public-navbar.component";
import {AuthNavbarComponent} from "./components/navbar/auth-navbar/auth-navbar.component";
import {RegistrationSnackBarComponent} from "./components/auth/register/registration-snack-bar/registration-snack-bar.component";
import {PassphraseDialogComponent} from "./components/passphrase-dialog/passphrase-dialog.component";
import {VaultSidenavComponent} from "./components/vaults/vault/vault-sidenav/vault-sidenav.component";
import {CreateVaultComponent} from "./components/vaults/vault/dialogs/create-vault/create-vault.component";
import {VaultContentComponent} from "./components/vaults/vault/vault-content/vault-content.component";
import {CreateEntryComponent} from "./components/vaults/vault/dialogs/create-entry/create-entry.component";
import {VaultInfoComponent} from "./components/vaults/vault/dialogs/vault-info/vault-info.component";
import {VaultUsersComponent} from "./components/vaults/vault/vault-users/vault-users.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LogoutComponent,
    VaultComponent,
    VaultRowComponent,
    PublicNavbarComponent,
    AuthNavbarComponent,
    RegistrationSnackBarComponent,
    PassphraseDialogComponent,
    VaultSidenavComponent,
    CreateVaultComponent,
    VaultContentComponent,
    CreateEntryComponent,
    VaultInfoComponent,
    VaultUsersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
