import {Component, Inject} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RsaEncryptionService} from "../services/rsa-encryption.service";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-passphrase-dialog',
  templateUrl: './passphrase-dialog.component.html',
  styleUrls: ['./passphrase-dialog.component.scss']
})
export class PassphraseDialogComponent {
  passphraseForm;
  triesNumber = 3;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder,
              private encryption: RsaEncryptionService,
              private authenticationService: AuthenticationService,
              public dialogRef: MatDialogRef<PassphraseDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { text: string }) {
    this.passphraseForm = this.formBuilder.group({
      passphrase: ''
    });
  }

  onSubmit(value: any) {
    this.encryption.decryptKeys(value.passphrase)
      .then(res => {
        this.errorMsg = '';
        this.dialogRef.close('provided');
      })
      .catch(err => {
        this.triesNumber--;
        if(this.triesNumber === 0){
          this.authenticationService.logout()
          this.dialogRef.close('failure');
        }else{
          this.errorMsg = 'Wrong passphrase provided. ' + this.triesNumber + ' tries left';
        }
      })
  }
}
