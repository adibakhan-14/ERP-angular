import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCollectedViewModalComponent } from './details-collected-view-modal.component';

describe('DetailsCollectedViewModalComponent', () => {
  let component: DetailsCollectedViewModalComponent;
  let fixture: ComponentFixture<DetailsCollectedViewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCollectedViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCollectedViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
