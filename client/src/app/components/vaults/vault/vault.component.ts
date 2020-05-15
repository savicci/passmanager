import { Component, OnInit } from '@angular/core';
import {VaultService} from "./vault.service";
import {Vault} from "./models";
import {PassphraseService} from "../../services/passphrase.service";

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {

  vaults: Vault[];

  constructor(private vaultService: VaultService, private passphraseService: PassphraseService) { }

  ngOnInit(): void {
    this.vaults = [];
    if(this.passphraseService.isPassphraseRequestNeeded()){
      this.passphraseService.requestPassphrase('Please enter passphrase for decryption of keys');
    }
  }

  async createNewVault() {
    await this.vaultService.createNewVault('thevault');
  }
}
