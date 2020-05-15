import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss']
})
export class AuthNavbarComponent implements OnInit {

  constructor(private authentication: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  logOutUser() {
    this.authentication.logout()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.warn(err.message);
        this.router.navigate(['/']);
      });
  }
}
