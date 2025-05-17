import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BanksService {
  baseUrl = 'https://brasilapi.com.br/api/banks/v1';

  constructor(private http: HttpClient) { }

  getBanks() {
    return this.http.get<any[]>(this.baseUrl);
  }
}
