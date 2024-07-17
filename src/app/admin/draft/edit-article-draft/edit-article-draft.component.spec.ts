import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArticleDraftComponent } from './edit-article-draft.component';

describe('EditArticleDraftComponent', () => {
  let component: EditArticleDraftComponent;
  let fixture: ComponentFixture<EditArticleDraftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditArticleDraftComponent]
    });
    fixture = TestBed.createComponent(EditArticleDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
