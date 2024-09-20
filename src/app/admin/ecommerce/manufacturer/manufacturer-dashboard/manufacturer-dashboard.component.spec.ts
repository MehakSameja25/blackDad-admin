import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerDashboardComponent } from './manufacturer-dashboard.component';

describe('ManufacturerDashboardComponent', () => {
  let component: ManufacturerDashboardComponent;
  let fixture: ComponentFixture<ManufacturerDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturerDashboardComponent]
    });
    fixture = TestBed.createComponent(ManufacturerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
