import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-vault-content',
  templateUrl: './vault-content.component.html',
  styleUrls: ['./vault-content.component.scss']
})
export class VaultContentComponent implements OnInit {
  @Input()
  vaultContent: any;

  constructor() { }

  ngOnInit(): void {
  }

}
