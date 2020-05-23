import {Component, OnInit} from '@angular/core';
import {PassphraseService} from "../../services/passphrase.service";
import {FormBuilder} from "@angular/forms";
import {VaultService} from "./services/vault.service";
import {RsaEncryptionService} from "../../services/rsa-encryption.service";
import {EncodingService} from "../../services/encoding.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateVaultComponent} from "./dialogs/create-vault/create-vault.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {

  vaults = undefined;
  sideNavOpened: boolean = true;
  vaultForm: any;

  constructor(private passphraseService: PassphraseService,
              private formBuilder: FormBuilder,
              private vaultService: VaultService,
              private dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute
              ) {
    this.vaultForm = this.formBuilder.group({
      name: '',
    })
  }

  ngOnInit(): void {
    this.vaults = [];
    const dialogRef = this.passphraseService.requestPassphrase('Please enter passphrase for decryption of keys');

    dialogRef.afterClosed().subscribe(() => {
      this.refreshVaults();
    })
  }

  createNewVault(value: any) {
    this.vaultService.createNewVault(value.name)
      .then(() => {
        this.refreshVaults();
      })
  }

  modifyVault() {
    this.vaults[0].data.modifiedDate = new Date();
    this.vaultService.modifyVault(this.vaults[0].data, this.vaults[0].id, this.vaults[0].key)
      .then(() => {
          this.refreshVaults();
        }
      )
  }

  deleteVault() {
    this.vaultService.deleteVault(this.vaults[0].id)
      .then(() => {
        this.refreshVaults();
      })
  }

  refreshVaults() {
    this.vaultService.getAllVaults()
      .then(vaults => {
        this.vaults = vaults;
      })
  }

  openVaultCreationDialog() {
    let newVaultRef = this.dialog.open(CreateVaultComponent, {
      width: '400px',
      disableClose: false,
    });

    newVaultRef.afterClosed().toPromise()
      .then(() => this.refreshVaults())
  }

  isMainPageOpened() {
    return this.router.url === '/vault/';
  }

  selectedVault() {
    const id = this.route.snapshot.params['id'];
    return this.vaults.find(vault => {
      return id === vault.id;
    })
  }

  changeSidenavVisibility() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  handleRefreshAction() {
    this.router.navigate(['/vault']);
    this.refreshVaults()
  }
}
