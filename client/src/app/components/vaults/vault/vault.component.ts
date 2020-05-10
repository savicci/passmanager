import { Component, OnInit } from '@angular/core';
import {VaultService} from "./vault.service";
import {Vault} from "./models";

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {

  vaults: Vault[];

  constructor(private vaultService: VaultService) { }

  ngOnInit(): void {
    this.vaults = [];
  }

  async createNewVault() {
    await this.vaultService.createNewVault('thevault');
  }
}
