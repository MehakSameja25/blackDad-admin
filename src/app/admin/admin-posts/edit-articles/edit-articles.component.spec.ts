import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArticlesComponent } from './edit-articles.component';

describe('EditArticlesComponent', () => {
  let component: EditArticlesComponent;
  let fixture: ComponentFixture<EditArticlesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditArticlesComponent]
    });
    fixture = TestBed.createComponent(EditArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
