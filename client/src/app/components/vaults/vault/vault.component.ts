import {Component, OnInit} from '@angular/core';
import {VaultService} from "./vault.service";
import {Vault, VaultRow} from "./models";
import {PassphraseService} from "../../services/passphrase.service";
import {FormBuilder} from "@angular/forms";
import {Parser} from "@angular/compiler";
import {ParserService} from "../../services/parser.service";

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {

  vaults: Vault[];
  sideNavOpened: boolean = false;
  vaultForm: any;

  constructor(private vaultService: VaultService, private passphraseService: PassphraseService, private formBuilder: FormBuilder, private parser: ParserService) {
    this.vaultForm = this.formBuilder.group({
      name: '',
    })
  }

  ngOnInit(): void {
    this.vaults = [];
    const dialogRef = this.passphraseService.requestPassphrase('Please enter passphrase for decryption of keys');

    dialogRef.afterClosed().subscribe(() => {
      this.vaultService.getAllVaults()
        .then(res => {
          this.vaults = this.parser.parseVaultsResponse(res)
        })
        .catch(err => {
          console.warn(err);
        })
    })
  }

  createNewVault(value: any) {
    console.log('creating vault');
    this.vaultService.createNewVault(value.name);
  }
}
