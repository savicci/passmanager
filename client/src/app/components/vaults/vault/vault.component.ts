import {Component, OnInit} from '@angular/core';
import {PassphraseService} from "../../services/passphrase.service";
import {FormBuilder} from "@angular/forms";
import {VaultService} from "./services/vault.service";
import {RsaEncryptionService} from "../../services/rsa-encryption.service";
import {EncodingService} from "../../services/encoding.service";

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {

  vaults = undefined;
  sideNavOpened: boolean = false;
  vaultForm: any;

  constructor(private passphraseService: PassphraseService, private formBuilder: FormBuilder, private vaultService: VaultService, private rsaEncryption: RsaEncryptionService, private encoding: EncodingService) {
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
}
