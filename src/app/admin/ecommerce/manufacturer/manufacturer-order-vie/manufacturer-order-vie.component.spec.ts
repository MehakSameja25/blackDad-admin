import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerOrderVieComponent } from './manufacturer-order-vie.component';

describe('ManufacturerOrderVieComponent', () => {
  let component: ManufacturerOrderVieComponent;
  let fixture: ComponentFixture<ManufacturerOrderVieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturerOrderVieComponent]
    });
    fixture = TestBed.createComponent(ManufacturerOrderVieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
