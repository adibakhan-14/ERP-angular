import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAddModifiedModalComponent } from './order-add-modified-modal.component';

describe('OrderAddModifiedModalComponent', () => {
  let component: OrderAddModifiedModalComponent;
  let fixture: ComponentFixture<OrderAddModifiedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAddModifiedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAddModifiedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
