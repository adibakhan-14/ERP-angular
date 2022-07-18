import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEditModalComponent } from './customer-edit-modal.component';

describe('CustomerEditModalComponent', () => {
  let component: CustomerEditModalComponent;
  let fixture: ComponentFixture<CustomerEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
