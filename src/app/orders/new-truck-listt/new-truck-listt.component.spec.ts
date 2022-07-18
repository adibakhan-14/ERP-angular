import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTruckListtComponent } from './new-truck-listt.component';

describe('NewTruckListtComponent', () => {
  let component: NewTruckListtComponent;
  let fixture: ComponentFixture<NewTruckListtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTruckListtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTruckListtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
