import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckDeleteComponent } from './truck-delete.component';

describe('TruckDeleteComponent', () => {
  let component: TruckDeleteComponent;
  let fixture: ComponentFixture<TruckDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
