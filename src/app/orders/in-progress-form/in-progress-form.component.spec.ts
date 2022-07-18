import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressFormComponent } from './in-progress-form.component';

describe('InProgressFormComponent', () => {
  let component: InProgressFormComponent;
  let fixture: ComponentFixture<InProgressFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InProgressFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InProgressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
