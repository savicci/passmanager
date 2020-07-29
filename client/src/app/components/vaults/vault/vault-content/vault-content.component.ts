import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {VaultResponse} from "../models";
import {MatDialog} from "@angular/material/dialog";
import {CreateEntryComponent} from "../dialogs/create-entry/create-entry.component";
import {VaultService} from "../services/vault.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PassphraseDialogComponent} from "../../../passphrase-dialog/passphrase-dialog.component";
import {VaultInfoComponent} from "../dialogs/vault-info/vault-info.component";
import {VaultUsersComponent} from "../vault-users/vault-users.component";

@Component({
  selector: 'app-vault-content',
  templateUrl: './vault-content.component.html',
  styleUrls: ['./vault-content.component.scss']
})
export class VaultContentComponent implements OnInit {
  @Input() vaultContent: VaultResponse;
  @Output() deleteEmitter = new EventEmitter();
  saveButtonColor = 'primary';

  constructor(private router: Router, private dialog: MatDialog, private vaultService: VaultService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    if(this.vaultContent === undefined){
      this.router.navigate(['/vault']);
    }
  }

  createNewEntry() {
    const dialogRef = this.dialog.open(CreateEntryComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        this.vaultContent.data.rows.push(result);
        this.saveButtonColor = 'warn';
      }
    });
  }

  saveVault() {
    this.vaultService.modifyVault(this.vaultContent.data, this.vaultContent.id, this.vaultContent.key)
      .then(res => {
        this.saveButtonColor = 'primary';
      })
      .catch(err => console.warn(err))
  }

  deleteRow($event: any) {
    this.vaultContent.data.rows = this.vaultContent.data.rows.filter(item => item !== $event);

    const snackbarRef = this.snackBar.open('Entry deleted', 'Undo', {
      duration: 3000
    });
    snackbarRef.onAction().subscribe(() => this.vaultContent.data.rows.push($event));
  }

  deleteVault() {
    const dialogRef = this.dialog.open(PassphraseDialogComponent, {
      data: {
        text: 'Please provide passphrase to delete this vault'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'provided'){
        this.vaultService.deleteVault(this.vaultContent.id)
          .catch(err => err)
          .then(res => {
            this.snackBar.open(res.body, null, {duration: 3000});
            this.router.navigate(['/vault']);
            this.deleteEmitter.emit();
          });
      }
    })
  }

  showVaultInfo() {
    this.dialog.open(VaultInfoComponent, {
      data: {
        vault: this.vaultContent
      }
    });
  }

  showVaultUsers() {
    this.dialog.open(VaultUsersComponent, {
      data: {
        id: this.vaultContent.id,
        role: this.vaultContent.role,
        key: this.vaultContent.key
      }
    });
  }

  showChanged($event: any) {
    this.saveButtonColor = 'warn';
  }
}
