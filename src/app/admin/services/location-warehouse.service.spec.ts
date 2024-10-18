import { TestBed } from '@angular/core/testing';

import { LocationWarehouseService } from './location-warehouse.service';

describe('LocationWarehouseService', () => {
  let service: LocationWarehouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationWarehouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
