import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {VaultUserService} from "../services/vault-user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-vault-users',
  templateUrl: './vault-users.component.html',
  styleUrls: ['./vault-users.component.scss']
})
export class VaultUsersComponent implements OnInit {
  addForm;
  users;
  errorMsg;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: string, role: string, key: string},
              private formBuilder: FormBuilder,
              private vaultUserService: VaultUserService,
              private snackBar: MatSnackBar) {
    this.addForm = this.formBuilder.group({
      email: '',
      role: ''
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  addUserToVault(value: any) {
    this.vaultUserService.addUserToVault(value.email, this.data.id, this.data.key, value.role)
      .then(() => {
        this.snackBar.open('User ' + value.email + ' successfully added to vault', null, {
          duration: 2000,
          verticalPosition: 'top'
        });
        this.refresh();
      })
      .catch(err => {
        console.warn(err);
        this.errorMsg = err.error;
      })
  }

  refresh() {
    this.vaultUserService.getAllVaultUsers(this.data.id)
      .then(res => {
        this.users = Object.values(res.body['vaultUsers']);
      });
  }
}
