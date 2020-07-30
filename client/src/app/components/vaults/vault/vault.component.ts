import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {VaultService} from "./services/vault.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateVaultComponent} from "./dialogs/create-vault/create-vault.component";
import {ActivatedRoute, Router} from "@angular/router";
import {PassphraseDialogComponent} from "../../passphrase-dialog/passphrase-dialog.component";

;

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {

  vaults = undefined;
  sideNavOpened: boolean = true;
  vaultForm: any;

  constructor(private formBuilder: FormBuilder,
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
    if (sessionStorage.getItem('userInfo') != null) {
      if (!this.vaults) {
        const dialogRef = this.dialog.open(PassphraseDialogComponent, {
          width: '300px',
          disableClose: true,
          data: {
            text: 'Please enter passphrase for decryption of keys'
          }
        });

        dialogRef.afterClosed().subscribe(() => {
          this.refreshVaults();
        })
      }
    } else {
      this.router.navigate(['/login']);
    }
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
    if (id && !this.vaults) {
      this.router.navigate(['/vault'])
    } else {
      return this.vaults.find(vault => {
        return id === vault.id;
      })
    }
  }

  changeSidenavVisibility() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  handleRefreshAction() {
    this.router.navigate(['/vault']);
    this.refreshVaults()
  }
}
