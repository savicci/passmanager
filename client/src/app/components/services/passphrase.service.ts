import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PassphraseDialogComponent} from "../passphrase-dialog/passphrase-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class PassphraseService {

  constructor(private dialog: MatDialog) { }

  public isPassphraseRequestNeeded(){
    return sessionStorage.getItem('passphraseProvided') !== 'true';
  }

  public requestPassphrase(promptText: string){
    const dialogRef = this.dialog.open(PassphraseDialogComponent, {
      width: '300px',
      disableClose: true,
      data: {
        text: promptText
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      sessionStorage.setItem('passphraseProvided', 'true');
    })
  }
}
