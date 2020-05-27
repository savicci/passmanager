import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultUserRowComponent } from './vault-user-row.component';

describe('VaultUserRowComponent', () => {
  let component: VaultUserRowComponent;
  let fixture: ComponentFixture<VaultUserRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultUserRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultUserRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
