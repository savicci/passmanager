import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-vault-sidenav',
  templateUrl: './vault-sidenav.component.html',
  styleUrls: ['./vault-sidenav.component.scss']
})
export class VaultSidenavComponent implements OnInit {

  @Input()
  sidenavRef;

  constructor() { }

  ngOnInit(): void {
  }

}
