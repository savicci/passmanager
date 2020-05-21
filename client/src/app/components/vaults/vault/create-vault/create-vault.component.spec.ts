import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVaultComponent } from './create-vault.component';

describe('CreateVaultComponent', () => {
  let component: CreateVaultComponent;
  let fixture: ComponentFixture<CreateVaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
