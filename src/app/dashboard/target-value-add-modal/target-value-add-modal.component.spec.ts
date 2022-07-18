import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetValueAddModalComponent } from './target-value-add-modal.component';

describe('TargetValueAddModalComponent', () => {
  let component: TargetValueAddModalComponent;
  let fixture: ComponentFixture<TargetValueAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetValueAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetValueAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
