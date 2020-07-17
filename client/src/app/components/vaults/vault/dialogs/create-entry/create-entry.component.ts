import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {UserService} from "../../../../services/user.service";
import {Vault, VaultRow} from "../../models";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-entry',
  templateUrl: './create-entry.component.html',
  styleUrls: ['./create-entry.component.scss']
})
export class CreateEntryComponent {
  entryForm: any;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private dialogRef: MatDialogRef<CreateEntryComponent>) {
    this.entryForm = this.formBuilder.group({
      name: '',
      username: '',
      password: '',
    })
  }

  createEntry(value: any) {
    let vaultRow: VaultRow = new VaultRow();
    vaultRow.name = value.name;
    vaultRow.username = value.username;
    vaultRow.password = value.password;
    vaultRow.createdBy = this.userService.getUserInfo().username;
    vaultRow.createdDate = new Date();
    this.dialogRef.close(vaultRow);
  }
}
