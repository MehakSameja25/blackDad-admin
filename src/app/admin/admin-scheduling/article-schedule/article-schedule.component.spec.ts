import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleScheduleComponent } from './article-schedule.component';

describe('ArticleScheduleComponent', () => {
  let component: ArticleScheduleComponent;
  let fixture: ComponentFixture<ArticleScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleScheduleComponent]
    });
    fixture = TestBed.createComponent(ArticleScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
