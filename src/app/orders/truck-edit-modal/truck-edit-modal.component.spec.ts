import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckEditModalComponent } from './truck-edit-modal.component';

describe('TruckEditModalComponent', () => {
  let component: TruckEditModalComponent;
  let fixture: ComponentFixture<TruckEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
