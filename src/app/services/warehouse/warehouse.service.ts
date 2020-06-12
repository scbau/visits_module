import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class WarehouseService {

  constructor(private http: HttpClient) {}

  fetchData(table, params): Observable<Object> {
    var fromDate = params.from;
    var toDate = params.to;
    
    return this.fetchCompliance(table, fromDate, toDate);
  }

  // !!!TODO: handlers
  fetchCompliance(table: string, fromDate: string, toDate: string): Observable<Object> {
    console.log(fromDate);
    console.log(toDate);
    let params = new HttpParams()
      .set("from", fromDate)
      .set("to", toDate);
    return this.http.get(`http://localhost:8080/api/warehouse/${table}/compute`, { params: params })
  }
}
