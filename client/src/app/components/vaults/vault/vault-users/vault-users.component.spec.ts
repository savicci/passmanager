import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultUsersComponent } from './vault-users.component';

describe('VaultUsersComponent', () => {
  let component: VaultUsersComponent;
  let fixture: ComponentFixture<VaultUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
