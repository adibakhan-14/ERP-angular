import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCustomerListComponent } from './new-customer-list.component';

describe('NewCustomerListComponent', () => {
  let component: NewCustomerListComponent;
  let fixture: ComponentFixture<NewCustomerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCustomerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
