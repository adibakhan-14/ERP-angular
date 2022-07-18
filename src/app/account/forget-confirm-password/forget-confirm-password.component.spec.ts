import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetConfirmPasswordComponent } from './forget-confirm-password.component';

describe('ForgetConfirmPasswordComponent', () => {
  let component: ForgetConfirmPasswordComponent;
  let fixture: ComponentFixture<ForgetConfirmPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetConfirmPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetConfirmPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
