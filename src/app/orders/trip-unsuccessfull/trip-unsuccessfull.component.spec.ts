import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripUnsuccessfullComponent } from './trip-unsuccessfull.component';

describe('TripUnsuccessfullComponent', () => {
  let component: TripUnsuccessfullComponent;
  let fixture: ComponentFixture<TripUnsuccessfullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripUnsuccessfullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripUnsuccessfullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
