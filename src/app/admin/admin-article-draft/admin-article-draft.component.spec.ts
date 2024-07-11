import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminArticleDraftComponent } from './admin-article-draft.component';

describe('AdminArticleDraftComponent', () => {
  let component: AdminArticleDraftComponent;
  let fixture: ComponentFixture<AdminArticleDraftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminArticleDraftComponent]
    });
    fixture = TestBed.createComponent(AdminArticleDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
