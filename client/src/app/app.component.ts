import { Component } from '@angular/core';
import {AuthenticationService} from "./components/services/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';

  constructor(private authentication: AuthenticationService) {
  }

  isAuthenticated() {
    return this.authentication.isAuthenticated();
  }
}
