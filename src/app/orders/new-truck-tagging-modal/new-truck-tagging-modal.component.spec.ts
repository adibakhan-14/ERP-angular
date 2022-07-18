import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTruckTaggingModalComponent } from './new-truck-tagging-modal.component';

describe('NewTruckTaggingModalComponent', () => {
  let component: NewTruckTaggingModalComponent;
  let fixture: ComponentFixture<NewTruckTaggingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTruckTaggingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTruckTaggingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
