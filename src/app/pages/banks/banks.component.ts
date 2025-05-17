import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BanksService } from './banks.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { iBanks } from '../../shared/interfaces/IBanks.interface';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [MatTableModule, HttpClientModule, MatPaginatorModule, MatProgressSpinnerModule],
  providers: [BanksService],
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.scss'
})
export class BanksComponent implements OnInit, AfterViewInit {
  data: iBanks[] = [];
  displayedColumns: string[] = ['code', 'name', 'fullName', 'ispb'];
  dataSource = new MatTableDataSource<iBanks>(this.data);

  loading = false;
  multipage = 10;
  dataSplit: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private banksService: BanksService) { }

  ngOnInit() {
    this.getBanks();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getBanks() : void {
    this.loading = true
    this.banksService.getBanks().subscribe(
      {
        next: (data) => {
          this.data = data;
          this.dataSplit = this.splitArray(data, this.multipage);
          this.dataSource = new MatTableDataSource<iBanks>(this.dataSplit[0]);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching banks:', error);
          this.loading = false;
        }
      }
    );
  }

  setPage(event: any) {
    this.dataSource = new MatTableDataSource<iBanks>(this.dataSplit[event.pageIndex]);
  }

  splitArray(itens: any, max: number) {
    return itens.reduce((count: any, item: any, index: any) => {
      const group = Math.floor(index / max);
      count[group] = [...(count[group] || []), item];
      return count;
    }, []);
  }
}


