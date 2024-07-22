import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeScheduleComponent } from './episode-schedule.component';

describe('EpisodeScheduleComponent', () => {
  let component: EpisodeScheduleComponent;
  let fixture: ComponentFixture<EpisodeScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpisodeScheduleComponent]
    });
    fixture = TestBed.createComponent(EpisodeScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
