import { TestBed } from '@angular/core/testing';

import { ArticlePopupService } from './article-popup.service';

describe('ArticlePopupService', () => {
  let service: ArticlePopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlePopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
