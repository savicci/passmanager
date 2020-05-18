import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PassphraseDialogComponent} from "../passphrase-dialog/passphrase-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class PassphraseService {

  constructor(private dialog: MatDialog) { }

  public requestPassphrase(promptText: string){
    return this.dialog.open(PassphraseDialogComponent, {
      width: '300px',
      disableClose: true,
      data: {
        text: promptText
      }
    });
  }
}
