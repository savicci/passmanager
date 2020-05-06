import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService) {
    this.registerForm = this.formBuilder.group({
      email: '',
      password: '',
      passwordReEnter: '',
      passphrase: ''
    })
  }

  ngOnInit(): void {
  }

  async onSubmit(data) {
    if (data.password !== data.passwordReEnter) {
      console.log('Passwords does not match');
    } else {
      await this.authService.register(data);
      this.registerForm.reset();
    }
  }
}
