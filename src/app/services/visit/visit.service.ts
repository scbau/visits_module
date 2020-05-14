import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class VisitService {

  constructor(private http: HttpClient) {}

  fetchVisit(fromDate: string, toDate: string): Observable<Object> {
    console.log(fromDate);
    console.log(toDate);
    let params = new HttpParams()
      .set("from", fromDate)
      .set("to", toDate);
    return this.http.get('http://localhost:8080/api/visits', { params: params })
    // return this.http.get('https://visits-backend.herokuapp.com/api/visits')
  }

  fetchAchievement(fromDate: string, toDate: string): Observable<Object> {
    console.log(fromDate);
    console.log(toDate);
    let params = new HttpParams()
      .set("from", fromDate)
      .set("to", toDate);
    return this.http.get('http://localhost:8080/api/visits/compute', { params: params })
  }

  fetchLastVisited(): Observable<Object> {
    return this.http.get('http://localhost:8080/api/accounts/lastVisited');
  }
}
