import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripChallanModalComponent } from './trip-challan-modal.component';

describe('TripChallanModalComponent', () => {
  let component: TripChallanModalComponent;
  let fixture: ComponentFixture<TripChallanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripChallanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripChallanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
