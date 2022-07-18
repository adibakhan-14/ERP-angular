import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckBoardComponent } from './truck-board.component';

describe('TruckBoardComponent', () => {
  let component: TruckBoardComponent;
  let fixture: ComponentFixture<TruckBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
