import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksComponent } from './banks.component';
import { BanksService } from './banks.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('BanksComponent', () => {
  let component: BanksComponent;
  let fixture: ComponentFixture<BanksComponent>;
  let banksService: jasmine.SpyObj<BanksService>;

  const mockBanksData = [
    { code: 1, name: 'Bank A', fullName: 'Bank A Full', ispb: '12345678' },
    { code: 2, name: 'Bank B', fullName: 'Bank B Full', ispb: '87654321' },
    { code: 3, name: 'Bank C', fullName: 'Bank C Full', ispb: '11223344' },
  ];
  beforeEach(async () => {
    const banksServiceSpy = jasmine.createSpyObj('BanksService', ['getBanks']);
    await TestBed.configureTestingModule({
      imports: [
        BanksComponent,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: BanksService, useValue: banksServiceSpy }],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    banksService = TestBed.inject(BanksService) as jasmine.SpyObj<BanksService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getBanks on initialization', () => {
    spyOn(component, 'getBanks');
    component.ngOnInit();
    expect(component.getBanks).toHaveBeenCalled();
  });


  it('should handle error in getBanks()', () => {
    const errorMessage = 'Error fetching banks';
    banksService.getBanks.and.returnValue(throwError(() => new Error(errorMessage)));
    spyOn(component, 'getBanks').and.callFake(() => {
      component.loading = true;
      banksService.getBanks().subscribe({
        next: (data) => {
          component.data = data;
          component.dataSplit = component.splitArray(data, component.multipage);
          component.dataSource = new MatTableDataSource(data);
          component.loading = false;
        },
        error: (error) => {
          console.error('Error fetching banks:', error);
          component.loading = false;
        }
      });
    })
    component.getBanks();

    expect(component.loading).toBeFalse();
    expect(component.data).toEqual([]);
    expect(component.dataSplit).toEqual([]);
    expect(component.dataSource.data).toEqual([]);
  });

  it('should fetch banks data successfully in getBanks()', () => {
    banksService.getBanks.and.returnValue(of(mockBanksData));
    spyOn(component, 'getBanks').and.callFake(() => {
      component.loading = true;
      banksService.getBanks().subscribe({
        next: (data) => {
          component.data = data;
          component.dataSplit = component.splitArray(data, component.multipage);
          component.dataSource = new MatTableDataSource(data);
          component.loading = false;
        },
        error: (error) => {
          console.error('Error fetching banks:', error);
          component.loading = false;
        }
      });
    })

    component.getBanks();
    expect(component.data).toEqual(mockBanksData);
    expect(component.loading).toBeFalse();

    expect(component.dataSplit.length).toBeGreaterThan(0);
    expect(component.dataSource.data).toEqual(component.dataSplit[0]);
  });

  it('should set the correct page in setPage()', () => {
    component.dataSplit = [
      [{ code: 1, name: 'Bank A', fullName: 'Bank A Full', ispb: '12345678' }],
      [{ code: 2, name: 'Bank B', fullName: 'Bank B Full', ispb: '87654321' }],
    ];

    component.setPage({ pageIndex: 1 });

    expect(component.dataSource.data).toEqual(component.dataSplit[1]);
  });


  it('should split array correctly in splitArray()', () => {
    const result = component.splitArray(mockBanksData, 2);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual([
      { code: 1, name: 'Bank A', fullName: 'Bank A Full', ispb: '12345678' },
      { code: 2, name: 'Bank B', fullName: 'Bank B Full', ispb: '87654321' },
    ]);
    expect(result[1]).toEqual([
      { code: 3, name: 'Bank C', fullName: 'Bank C Full', ispb: '11223344' },
    ]);
  });

});
