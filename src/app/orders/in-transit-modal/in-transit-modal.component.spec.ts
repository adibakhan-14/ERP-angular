import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InTransitModalComponent } from './in-transit-modal.component';

describe('InTransitModalComponent', () => {
  let component: InTransitModalComponent;
  let fixture: ComponentFixture<InTransitModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InTransitModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InTransitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
