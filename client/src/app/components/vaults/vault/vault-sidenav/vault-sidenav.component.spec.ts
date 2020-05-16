import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultSidenavComponent } from './vault-sidenav.component';

describe('VaultSidenavComponent', () => {
  let component: VaultSidenavComponent;
  let fixture: ComponentFixture<VaultSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
