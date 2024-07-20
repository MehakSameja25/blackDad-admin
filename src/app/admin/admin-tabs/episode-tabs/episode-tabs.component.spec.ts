import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeTabsComponent } from './episode-tabs.component';

describe('EpisodeTabsComponent', () => {
  let component: EpisodeTabsComponent;
  let fixture: ComponentFixture<EpisodeTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpisodeTabsComponent]
    });
    fixture = TestBed.createComponent(EpisodeTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
