import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanModalComponent } from './challan-modal.component';

describe('ChallanModalComponent', () => {
  let component: ChallanModalComponent;
  let fixture: ComponentFixture<ChallanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
