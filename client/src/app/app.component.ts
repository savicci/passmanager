import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./components/services/authentication.service";
import {HttpClient} from "@angular/common/http";
import {UserService} from "./components/services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private authentication: AuthenticationService, private httpClient: HttpClient, private userService: UserService) {
  }

  isAuthenticated() {
    return this.authentication.isAuthenticated();
  }

  ngOnInit(): void {
    // used to retrieve csrf token from server if not logged in
    this.httpClient.get('/auth/user',{observe: 'response'}).toPromise()
      .then(res => {
        this.userService.setUserInfo(res.body)

      })
      .catch(err => err);
  }
}
