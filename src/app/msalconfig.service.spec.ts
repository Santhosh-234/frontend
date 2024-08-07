import { TestBed } from '@angular/core/testing';

import { MsalconfigService } from './msalconfig.service';

describe('MsalconfigService', () => {
  let service: MsalconfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsalconfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
