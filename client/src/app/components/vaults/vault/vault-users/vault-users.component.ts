import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {VaultUserService} from "../services/vault-user.service";

@Component({
  selector: 'app-vault-users',
  templateUrl: './vault-users.component.html',
  styleUrls: ['./vault-users.component.scss']
})
export class VaultUsersComponent implements OnInit {
  addForm;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: string, role: string, key: string}, private formBuilder: FormBuilder, private vaultUserService: VaultUserService) {
    this.addForm = this.formBuilder.group({
      email: '',
      role: ''
    });
  }

  ngOnInit(): void {
  }

  addUserToVault(value: any) {
    this.vaultUserService.addUserToVault(value.email, this.data.id, this.data.key, value.role)
      .then(res => {
        console.log(res);
        this.addForm.reset();
      })
      .catch(err => {

      })
  }
}
