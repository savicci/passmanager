import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm;
  errorMsg;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  ngOnInit(): void {
  }

  authenticate(data) {
    this.authService.login(data)
      .then(() => {
        this.errorMsg = undefined;
        this.router.navigate(['/vault']);
      })
      .catch(err => {
        this.errorMsg = err.message;
      })
    this.loginForm.reset();
  }
}
