import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStatusV2Component } from './update-status-v2.component';

describe('UpdateStatusV2Component', () => {
  let component: UpdateStatusV2Component;
  let fixture: ComponentFixture<UpdateStatusV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateStatusV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStatusV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
