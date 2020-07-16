import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VaultRow} from "../models";
import {FormBuilder, FormControl} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {Clipboard} from "@angular/cdk/clipboard";

// thats some macaroni/spaghetti code, but no time to make it look better
@Component({
  selector: 'app-vault-row',
  templateUrl: './vault-row.component.html',
  styleUrls: ['./vault-row.component.scss']
})
export class VaultRowComponent implements OnInit {

  @Input() vaultRow: VaultRow;
  @Output() deleteEmitter = new EventEmitter();
  @Output() changeEmitter = new EventEmitter();
  entryForm: any;
  disabled: boolean = true;
  cache: any;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private clipboard: Clipboard) {
  }

  ngOnInit(): void {
    this.entryForm = this.formBuilder.group({
      name: new FormControl({value: this.vaultRow.name, disabled: this.disabled}),
      username: new FormControl({value: this.vaultRow.username, disabled: this.disabled}),
      password: new FormControl({value: this.vaultRow.password, disabled: this.disabled}),
      createdDate: new FormControl({value: this.vaultRow.createdDate, disabled: true}),
      updatedDate: new FormControl({value: this.vaultRow.updatedDate, disabled: true})
    });
  }

  changeEditMode() {
    if (this.disabled === true) {
      this.cache = {
        username: this.entryForm.value.username,
        password: this.entryForm.value.password
      }
      this.disabled = false;
      this.entryForm.controls['username'].enable();
      this.entryForm.controls['password'].enable();
    } else if (this.disabled === false) {
      this.disabled = true;
      this.entryForm.controls['username'].setValue(this.cache.username)
      this.entryForm.controls['password'].setValue(this.cache.password)
      this.entryForm.controls['username'].disable();
      this.entryForm.controls['password'].disable();
    }
  }

  getIconType() {
    return this.disabled === true ? 'edit' : 'undo'
  }

  saveChanges() {
    this.disabled = true;
    this.vaultRow.username = this.entryForm.value.username;
    this.vaultRow.password = this.entryForm.value.password;
    this.vaultRow.updatedBy = this.userService.getUserInfo().username;
    this.vaultRow.updatedDate = JSON.parse(JSON.stringify(new Date())) // XDD but somehow formats as i would like
    this.entryForm.controls['updatedDate'].setValue(this.vaultRow.updatedDate);
    this.changeEmitter.emit(true);
  }

  copyToClipboard() {
    this.clipboard.copy(this.vaultRow.password);
  }

  deleteEntry() {
    this.deleteEmitter.emit(this.vaultRow);
  }
}
