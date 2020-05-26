import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RsaEncryptionService} from "../services/rsa-encryption.service";

@Component({
  selector: 'app-passphrase-dialog',
  templateUrl: './passphrase-dialog.component.html',
  styleUrls: ['./passphrase-dialog.component.scss']
})
export class PassphraseDialogComponent implements OnInit {
  passphraseForm;
  errorMsg: string;

  constructor(private formBuilder: FormBuilder,
              private encryption: RsaEncryptionService,
              public dialogRef: MatDialogRef<PassphraseDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { text: string }) {
    this.passphraseForm = this.formBuilder.group({
      passphrase: ''
    });
  }

  ngOnInit(): void {
  }

  onSubmit(value: any) {
    this.encryption.decryptKeys(value.passphrase)
      .then(res => {
        this.errorMsg = '';
        this.dialogRef.close('provided');
      })
      .catch(err => {
        this.errorMsg = 'Wrong passphrase provided';
      })
  }
}
