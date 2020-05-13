import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { VisitService } from '../../services/visit/visit.service'

export interface TableDataSample {
  account: string;
  lastVisitInDays: number;
  position: number;
}

const ELEMENT_DATA: TableDataSample[] = [
  { position: 1, account: 'EPB1273 Big Rig 4x4', lastVisitInDays: 7 },
  { position: 2, account: 'A1588 CARMECH', lastVisitInDays: 13 }
];

const ELEMENT_DATA2: TableDataSample[] = [
  { position: 1, account: 'S1821 BATTERIES U NEED', lastVisitInDays: 27 }
];

const ELEMENT_DATA3: TableDataSample[] = [
  {
    position: 1, account: 'M4140 ULTRA TUNE KANGAROO FLAT', lastVisitInDays: 34 },
  {
    position: 2, account: 'N1201 BATTERY BROKERS', lastVisitInDays: 35 }
];


@Component({
  selector: 'app-dashboard',
  templateUrl: './not.visited.component.html',
  styleUrls: ['./not.visited.component.css']
})
export class NotVisitedComponent implements OnInit {

  displayedColumns: string[] = ['position', 'account', 'lastVisitInDays'];
  dataSource = ELEMENT_DATA;
  dataSource2 = ELEMENT_DATA2;
  dataSource3 = ELEMENT_DATA3;

  constructor(private visitService: VisitService) { }

  ngOnInit(): void {
    
  }
}
