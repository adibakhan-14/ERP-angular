import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressV2Component } from './in-progress-v2.component';

describe('InProgressV2Component', () => {
  let component: InProgressV2Component;
  let fixture: ComponentFixture<InProgressV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InProgressV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InProgressV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
