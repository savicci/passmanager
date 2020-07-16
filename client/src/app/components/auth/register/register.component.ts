import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {ErrorStateMatcher} from "@angular/material/core";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm;
  errorMsg;
  matcher = new MyErrorStateMatcher();
  hidePassphrase: boolean = true;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router, private _snackBar: MatSnackBar) {
    this.registerForm = this.formBuilder.group({
      email: '',
      password: '',
      passwordReEnter: '',
      passphrase: ''
    }, {validator: this.checkPasswords});
  }

  ngOnInit(): void {
  }

  async onSubmit(data) {
    await this.authService.register(data)
      .then(() => {
        this._snackBar.open("Registration succesfull. You can now log in", null, {
          duration: 5000,
          verticalPosition: "top"
        });
        this.router.navigate(['/login'])
      })
      .catch(err => {
        console.log(err);
        this.errorMsg = err.error;
      })

    this.registerForm.reset();
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('passwordReEnter').value;

    return pass === confirmPass ? null : {notSame: true}
  }
}

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}
