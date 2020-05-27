import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {VaultUserService} from "../../services/vault-user.service";

@Component({
  selector: 'app-vault-user-row',
  templateUrl: './vault-user-row.component.html',
  styleUrls: ['./vault-user-row.component.scss']
})
export class VaultUserRowComponent implements OnInit {
  @Input() user;
  @Input() role;
  @Input() vaultId;

  reqMessage: string;
  changeActive: boolean = false;
  permissionForm: any;

  constructor(private formBuilder: FormBuilder, private vaultUserService: VaultUserService) {
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
      .then(res => {
        this.reqMessage = 'Succesfully changed';
      })
      .catch(err => {
        this.reqMessage = 'There was an error';
      })
  }

  deleteVaultUser() {
    this.vaultUserService.deleteUser(this.user.email, this.vaultId);
  }
}
