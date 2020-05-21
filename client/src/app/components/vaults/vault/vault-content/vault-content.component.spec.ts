import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultContentComponent } from './vault-content.component';

describe('VaultContentComponent', () => {
  let component: VaultContentComponent;
  let fixture: ComponentFixture<VaultContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
