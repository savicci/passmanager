import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {VaultResponse} from "../models";

@Component({
  selector: 'app-vault-content',
  templateUrl: './vault-content.component.html',
  styleUrls: ['./vault-content.component.scss']
})
export class VaultContentComponent implements OnInit {
  @Input()
  vaultContent: VaultResponse;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    if(this.vaultContent === undefined){
      this.router.navigate(['/vault']);
    }
  }

}
