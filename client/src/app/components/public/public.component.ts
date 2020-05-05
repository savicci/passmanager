import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {
  response = '';
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  getPublicResponse() {
    this.httpClient.get('/public', {responseType: 'text'}).subscribe(content =>{
      this.response = content.toString()})
  }
}
