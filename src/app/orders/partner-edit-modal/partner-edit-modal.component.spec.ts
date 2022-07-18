import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerEditModalComponent } from './partner-edit-modal.component';

describe('PartnerEditModalComponent', () => {
  let component: PartnerEditModalComponent;
  let fixture: ComponentFixture<PartnerEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
