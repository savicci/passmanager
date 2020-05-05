import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  logout() {
    this.httpClient.get('/auth/logout', {responseType: 'text'}).pipe(
      catchError(err => {
        console.error(err);
        return of(err);
      })
    ).subscribe(response => console.log(response));
  }
}
