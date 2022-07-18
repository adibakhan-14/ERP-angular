import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadCompleteModalComponent } from './load-complete-modal.component';

describe('LoadCompleteModalComponent', () => {
  let component: LoadCompleteModalComponent;
  let fixture: ComponentFixture<LoadCompleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadCompleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadCompleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
