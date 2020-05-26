import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss']
})
export class AuthNavbarComponent implements OnInit,OnDestroy {
  interval;

  constructor(private authentication: AuthenticationService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.userService.refreshUserInfo();
    }, 15000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
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
