import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {VaultService} from "../../services/vault.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-vault',
  templateUrl: './create-vault.component.html',
  styleUrls: ['./create-vault.component.scss']
})
export class CreateVaultComponent implements OnInit {
  vaultForm: any;
  errorMsg: any;

  constructor(private formBuilder: FormBuilder, private vaultService: VaultService, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<CreateVaultComponent>) {
    this.vaultForm = this.formBuilder.group({
      name: ''
    });
  }

  ngOnInit(): void {
  }

  createVault(value: any){
    this.vaultService.createNewVault(value.name)
      .then(() => {
        this.snackBar.open('vault created', null, {duration: 2000});
        this.dialogRef.close();
      })
      .catch(err => this.errorMsg = err.message)
  }

}
