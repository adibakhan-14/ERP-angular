import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTripStatementComponent } from './daily-trip-statement.component';

describe('DailyTripStatementComponent', () => {
  let component: DailyTripStatementComponent;
  let fixture: ComponentFixture<DailyTripStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyTripStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTripStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
