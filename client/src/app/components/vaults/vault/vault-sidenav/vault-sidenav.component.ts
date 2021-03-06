import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-vault-sidenav',
  templateUrl: './vault-sidenav.component.html',
  styleUrls: ['./vault-sidenav.component.scss']
})
export class VaultSidenavComponent implements OnInit {
  @Input() vaults;
  @Output() refreshEmitter = new EventEmitter();
  @Output() newVaultEmitter = new EventEmitter();
  @Output() closeSidenavEmitter = new EventEmitter();
  private id: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  getIconType(id: string) {
    this.id = this.route.snapshot.params['id'];
    return this.id === id ? 'folder_open' : 'folder';
  }

}
