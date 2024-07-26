import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginnedGuard } from './loginned.guard';

describe('loginnedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginnedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
