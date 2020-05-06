import {Component, Input, OnInit} from '@angular/core';
import {VaultRow} from "../models";

@Component({
  selector: 'app-vault-row',
  templateUrl: './vault-row.component.html',
  styleUrls: ['./vault-row.component.scss']
})
export class VaultRowComponent implements OnInit {

  @Input()
  vaultRow: VaultRow;

  constructor() { }

  ngOnInit(): void {
  }

}
