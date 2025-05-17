import { TestBed } from '@angular/core/testing';

import { BanksService } from './banks.service';
import { HttpClientModule } from '@angular/common/http';

describe('BanksService', () => {
  let service: BanksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule]
    });
    service = TestBed.inject(BanksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch banks data', () => {
    service.getBanks().subscribe((data) => {
      expect(data).toBeTruthy();
      expect(data.length).toBeGreaterThan(0);
    });
  });

  it('should return an array of banks', () => {
    service.getBanks().subscribe((data) => {
      expect(data).toEqual(jasmine.any(Array));
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toEqual(jasmine.objectContaining({
        code: jasmine.any(Number),
        name: jasmine.any(String),
        fullName: jasmine.any(String),
        ispb: jasmine.any(String)
      }));
    });
  });
  
});
