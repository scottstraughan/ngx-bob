import { TestBed } from '@angular/core/testing';

import { BobService } from './bob.service';

describe('BobService', () => {
  let service: BobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
