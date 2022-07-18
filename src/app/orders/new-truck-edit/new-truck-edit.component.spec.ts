import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTruckEditComponent } from './new-truck-edit.component';

describe('NewTruckEditComponent', () => {
  let component: NewTruckEditComponent;
  let fixture: ComponentFixture<NewTruckEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTruckEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTruckEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
