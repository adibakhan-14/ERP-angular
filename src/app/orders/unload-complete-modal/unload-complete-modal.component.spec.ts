import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloadCompleteModalComponent } from './unload-complete-modal.component';

describe('UnloadCompleteModalComponent', () => {
  let component: UnloadCompleteModalComponent;
  let fixture: ComponentFixture<UnloadCompleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnloadCompleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnloadCompleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
