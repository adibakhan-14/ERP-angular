import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckListModalComponent } from './truck-list-modal.component';

describe('TruckListModalComponent', () => {
  let component: TruckListModalComponent;
  let fixture: ComponentFixture<TruckListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckListModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
