import {Component, OnInit} from '@angular/core';
import {VaultService} from "./vault.service";
import {Vault} from "./models";
import {PassphraseService} from "../../services/passphrase.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {

  vaults: Vault[];
  sideNavOpened: boolean = false;
  vaultForm: any;

  constructor(private vaultService: VaultService, private passphraseService: PassphraseService, private formBuilder: FormBuilder) {
    this.vaultForm = this.formBuilder.group({
      name: '',
    })
  }

  ngOnInit(): void {
    this.vaults = [];
    if (this.passphraseService.isPassphraseRequestNeeded()) {
      this.passphraseService.requestPassphrase('Please enter passphrase for decryption of keys');
    }
  }

  createNewVault(value: any) {
    console.log('creating vault');
    this.vaultService.createNewVault(value.name);
  }
}
