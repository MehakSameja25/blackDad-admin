import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManufacturerComponent } from './edit-manufacturer.component';

describe('EditManufacturerComponent', () => {
  let component: EditManufacturerComponent;
  let fixture: ComponentFixture<EditManufacturerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditManufacturerComponent]
    });
    fixture = TestBed.createComponent(EditManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
