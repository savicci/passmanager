import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {VaultResponse} from "../models";
import {MatDialog} from "@angular/material/dialog";
import {CreateEntryComponent} from "../dialogs/create-entry/create-entry.component";

@Component({
  selector: 'app-vault-content',
  templateUrl: './vault-content.component.html',
  styleUrls: ['./vault-content.component.scss']
})
export class VaultContentComponent implements OnInit {
  @Input()
  vaultContent: VaultResponse;

  constructor(private router: Router, private dialog: MatDialog) {
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
      }
    });
  }
}
