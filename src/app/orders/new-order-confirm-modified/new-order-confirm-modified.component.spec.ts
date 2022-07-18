import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderConfirmModifiedComponent } from './new-order-confirm-modified.component';

describe('NewOrderConfirmModifiedComponent', () => {
  let component: NewOrderConfirmModifiedComponent;
  let fixture: ComponentFixture<NewOrderConfirmModifiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOrderConfirmModifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrderConfirmModifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
