import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEpisodeDraftComponent } from './admin-episode-draft.component';

describe('AdminEpisodeDraftComponent', () => {
  let component: AdminEpisodeDraftComponent;
  let fixture: ComponentFixture<AdminEpisodeDraftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminEpisodeDraftComponent]
    });
    fixture = TestBed.createComponent(AdminEpisodeDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
