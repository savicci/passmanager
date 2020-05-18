import {Component, OnInit} from '@angular/core';
import {Vault, VaultRow} from "./models";
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

  constructor( private passphraseService: PassphraseService, private formBuilder: FormBuilder) {
    this.vaultForm = this.formBuilder.group({
      name: '',
    })
  }

  ngOnInit(): void {
    this.vaults = [];
    const dialogRef = this.passphraseService.requestPassphrase('Please enter passphrase for decryption of keys');

    dialogRef.afterClosed().subscribe(() => {
    })
  }

  createNewVault(value: any) {
    console.log('creating vault');
  }
}
