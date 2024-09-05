import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalisProductComponent } from './detalis-product.component';

describe('DetalisProductComponent', () => {
  let component: DetalisProductComponent;
  let fixture: ComponentFixture<DetalisProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalisProductComponent]
    });
    fixture = TestBed.createComponent(DetalisProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
