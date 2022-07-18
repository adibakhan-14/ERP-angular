import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddModalComponent } from './product-add-modal.component';

describe('ProductAddModalComponent', () => {
  let component: ProductAddModalComponent;
  let fixture: ComponentFixture<ProductAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
