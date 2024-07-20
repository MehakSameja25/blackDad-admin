import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleTabsComponent } from './article-tabs.component';

describe('ArticleTabsComponent', () => {
  let component: ArticleTabsComponent;
  let fixture: ComponentFixture<ArticleTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleTabsComponent]
    });
    fixture = TestBed.createComponent(ArticleTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
