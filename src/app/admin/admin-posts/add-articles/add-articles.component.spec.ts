import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArticlesComponent } from './add-articles.component';

describe('AddArticlesComponent', () => {
  let component: AddArticlesComponent;
  let fixture: ComponentFixture<AddArticlesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddArticlesComponent]
    });
    fixture = TestBed.createComponent(AddArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
