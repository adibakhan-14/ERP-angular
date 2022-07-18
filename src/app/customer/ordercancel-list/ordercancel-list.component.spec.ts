import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdercancelListComponent } from './ordercancel-list.component';

describe('OrdercancelListComponent', () => {
  let component: OrdercancelListComponent;
  let fixture: ComponentFixture<OrdercancelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdercancelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdercancelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
