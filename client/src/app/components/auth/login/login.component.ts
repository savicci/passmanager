import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: '',
      passphrase: ''
    });
  }

  ngOnInit(): void {
  }

  authenticate(data) {
    this.authService.login({email: data.email, password: data.password}, data.passphrase);
    this.loginForm.reset();
  }
}
