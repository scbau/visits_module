import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class WarehouseService {

  constructor(private http: HttpClient) {}

  fetchData(table, params): Observable<Object> {
    /*var fromDate = params.from;
    var toDate = params.to;*/
    var fromDate = [], toDate = [];
    for (var item of params) {
      fromDate.push(item.from);
      toDate.push(item.to);
    }

    return this.fetchCompliance(table, fromDate, toDate);
  }

  // !!!TODO: handlers
  fetchCompliance(table: string, fromDate: string[], toDate: string[]): Observable<Object> {
    console.log(fromDate);
    console.log(toDate);
    let params = new HttpParams()
    fromDate.forEach(from => {
      params = params.append('from[]', from);
    });
    toDate.forEach(to => {
      params = params.append('to[]', to);
    });
      /*.set("from", fromDate)
      .set("to", toDate);*/
    console.log(params.toString());
    return this.http.get(`http://localhost:8080/api/warehouse/${table}/compute`, { params: params })
  }
}
