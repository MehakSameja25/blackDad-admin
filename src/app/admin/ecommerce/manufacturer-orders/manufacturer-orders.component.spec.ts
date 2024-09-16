import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerOrdersComponent } from './manufacturer-orders.component';

describe('ManufacturerOrdersComponent', () => {
  let component: ManufacturerOrdersComponent;
  let fixture: ComponentFixture<ManufacturerOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturerOrdersComponent]
    });
    fixture = TestBed.createComponent(ManufacturerOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
