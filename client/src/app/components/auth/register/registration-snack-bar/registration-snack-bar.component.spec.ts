import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSnackBardComponent } from './registration-snack-bar.component';

describe('RegistrationSnackBardComponent', () => {
  let component: RegistrationSnackBardComponent;
  let fixture: ComponentFixture<RegistrationSnackBardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationSnackBardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSnackBardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
