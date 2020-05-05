import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {
  response: any;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  getPrivateResponse() {
    this.httpClient.get('/protected', {responseType: 'text'})
      .pipe(
        catchError(err => {
          console.error(err);
          return of(err);
        })
      )
      .subscribe(content => {
        console.log(content);
        this.response = content
      })
  }
}
