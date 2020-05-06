import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultRowComponent } from './vault-row.component';

describe('VaultRowComponent', () => {
  let component: VaultRowComponent;
  let fixture: ComponentFixture<VaultRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
