import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {VaultResponse} from "../../models";

@Component({
  selector: 'app-vault-info',
  templateUrl: './vault-info.component.html',
  styleUrls: ['./vault-info.component.scss']
})
export class VaultInfoComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { vault: VaultResponse }) {
  }
}
