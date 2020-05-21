import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-vault-sidenav',
  templateUrl: './vault-sidenav.component.html',
  styleUrls: ['./vault-sidenav.component.scss']
})
export class VaultSidenavComponent implements OnInit {

  @Input()
  sidenavRef;

  @Input()
  vaults;

  @Output()
  refreshEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  refresh() {
    this.refreshEmitter.emit(true);
  }
}
