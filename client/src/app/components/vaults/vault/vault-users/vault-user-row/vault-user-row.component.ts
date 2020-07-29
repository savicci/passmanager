import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {VaultUserService} from "../../services/vault-user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-vault-user-row',
  templateUrl: './vault-user-row.component.html',
  styleUrls: ['./vault-user-row.component.scss']
})
export class VaultUserRowComponent implements OnInit {
  @Input() user;
  @Input() role;
  @Input() vaultId;
  @Output() changeEmitter = new EventEmitter();
  errorMsg;

  reqMessage: string;
  changeActive: boolean = false;
  permissionForm: any;

  constructor(private formBuilder: FormBuilder, private vaultUserService: VaultUserService, private snackBar: MatSnackBar) {
    this.permissionForm = this.formBuilder.group({
      role: ''
    })
  }

  ngOnInit(): void {
  }

  changeFormVisibility() {
    this.changeActive = !this.changeActive;
  }

  changeUserPermissions(value: any) {
    this.vaultUserService.modifyPermissions(value.role, this.user.email, this.vaultId)
      .then(() => {
        this.snackBar.open('Successfully changed permission to ' + this.user.email, null, {
          duration: 2000,
          verticalPosition: 'top'
        });
        this.changeEmitter.emit();
      })
      .catch(err => {
        this.errorMsg = err.error;
      })
  }

  deleteVaultUser() {
    this.vaultUserService.deleteUser(this.user.email, this.vaultId)
      .then(() => {
        this.snackBar.open('Successfully deleted user ' + this.user.email, null, {
          duration: 2000,
          verticalPosition: 'top'
        });
        this.changeEmitter.emit();
      })
      .catch(err => {
        this.errorMsg = err.error;
      })
  }
}
