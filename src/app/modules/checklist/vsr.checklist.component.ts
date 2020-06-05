import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { VisitService } from '../../services/visit/visit.service'

export interface ChecklistData {
  timesChecked: number;
  timesCompliant: number;
  compliance: string;
  timesCritical: number;
  location: string;
  forklift: string;
}


const ELEMENT_DATA: ChecklistData[] = [
  { timesChecked: 7, forklift: 'Forklift 1', location: 'NSW', timesCompliant: 5, compliance: "71%", timesCritical: 0 },
  { timesChecked: 6, forklift: 'Forklift 2', location: 'NSW', timesCompliant: 6, compliance: "100%", timesCritical: 1 },
  { timesChecked: 3, forklift: 'Forklift 1', location: 'SA', timesCompliant: 1, compliance: "33%", timesCritical: 1 },
  { timesChecked: 2, forklift: 'Forklift 2', location: 'SA', timesCompliant: 1, compliance: "50%", timesCritical: 0 },
  // { timesChecked: 20, location: 'Hydrogen', timesCompliant: 15, compliance: "75%", timesCritical: 2 },
];


const ELEMENT_DATA2: ChecklistData[] = [
  { timesChecked: 14, forklift: 'Forklift 1', location: 'NSW', timesCompliant: 8, compliance: "64%", timesCritical: 2 },
  { timesChecked: 10, forklift: 'Forklift 2', location: 'NSW', timesCompliant: 10, compliance: "100%", timesCritical: 0 },
  { timesChecked: 5, forklift: 'Forklift 1', location: 'SA', timesCompliant: 1, compliance: "20%", timesCritical: 1 },
  { timesChecked: 9, forklift: 'Forklift 2', location: 'SA', timesCompliant: 4, compliance: "89%", timesCritical: 5 },
  // { timesChecked: 20, location: 'Hydrogen', timesCompliant: 15, compliance: "75%", timesCritical: 2 },
];

const ELEMENT_DATA3: ChecklistData[] = [
  { timesChecked: 30, forklift: 'Forklift 1', location: 'NSW', timesCompliant: 23, compliance: "77%", timesCritical: 4 },
  { timesChecked: 12, forklift: 'Forklift 2', location: 'NSW', timesCompliant: 10, compliance: "83%", timesCritical: 0 },
  { timesChecked: 10, forklift: 'Forklift 1', location: 'SA', timesCompliant: 3, compliance: "33%", timesCritical: 1 },
  { timesChecked: 16, forklift: 'Forklift 2', location: 'SA', timesCompliant: 10, compliance: "62%", timesCritical: 5 },
  // { timesChecked: 20, location: 'Hydrogen', timesCompliant: 15, compliance: "75%", timesCritical: 2 },
];

const ELEMENT_DATA_VSR: ChecklistData[] = [
  { timesChecked: 7, forklift: 'VSR Vehicle 1', location: 'NSW', timesCompliant: 4, compliance: "57%", timesCritical: 3 },
  { timesChecked: 5, forklift: 'VSR Vehicle 2', location: 'NSW', timesCompliant: 3, compliance: "60%", timesCritical: 1 },
  { timesChecked: 4, forklift: 'VSR Vehicle 1', location: 'STAU', timesCompliant: 2, compliance: "50%", timesCritical: 1 },
  { timesChecked: 4, forklift: 'VSR Vehicle 2', location: 'STAU', timesCompliant: 3, compliance: "75%", timesCritical: 1 },
  { timesChecked: 7, forklift: 'VSR Vehicle 1', location: 'QLD', timesCompliant: 4, compliance: "57%", timesCritical: 3 },
  { timesChecked: 5, forklift: 'VSR Vehicle 2', location: 'QLD', timesCompliant: 3, compliance: "60%", timesCritical: 1 },
  { timesChecked: 4, forklift: 'VSR Vehicle 1', location: 'VIC', timesCompliant: 2, compliance: "50%", timesCritical: 1 },
  { timesChecked: 4, forklift: 'VSR Vehicle 2', location: 'VIC', timesCompliant: 3, compliance: "75%", timesCritical: 1 },
  { timesChecked: 7, forklift: 'VSR Vehicle 1', location: 'WA', timesCompliant: 4, compliance: "57%", timesCritical: 3 },
  { timesChecked: 5, forklift: 'VSR Vehicle 2', location: 'WA', timesCompliant: 3, compliance: "60%", timesCritical: 1 },
  // { timesChecked: 20, location: 'Hydrogen', timesCompliant: 15, compliance: "75%", timesCritical: 2 },
];

const ELEMENT_DATA_VSR2: ChecklistData[] = [
  { timesChecked: 14, forklift: 'VSR Vehicle 1', location: 'NSW', timesCompliant: 10, compliance: "71%", timesCritical: 3 },
  { timesChecked: 10, forklift: 'VSR Vehicle 2', location: 'NSW', timesCompliant: 8, compliance: "80%", timesCritical: 1 },
  { timesChecked: 5, forklift: 'VSR Vehicle 1', location: 'STAU', timesCompliant: 1, compliance: "20%", timesCritical: 1 },
  { timesChecked: 9, forklift: 'VSR Vehicle 2', location: 'STAU', timesCompliant: 8, compliance: "89%", timesCritical: 1 },
  { timesChecked: 14, forklift: 'VSR Vehicle 1', location: 'QLD', timesCompliant: 10, compliance: "71%", timesCritical: 3 },
  { timesChecked: 10, forklift: 'VSR Vehicle 2', location: 'QLD', timesCompliant: 8, compliance: "80%", timesCritical: 1 },
  { timesChecked: 5, forklift: 'VSR Vehicle 1', location: 'VIC', timesCompliant: 1, compliance: "20%", timesCritical: 1 },
  { timesChecked: 9, forklift: 'VSR Vehicle 2', location: 'VIC', timesCompliant: 8, compliance: "89%", timesCritical: 1 },
  { timesChecked: 14, forklift: 'VSR Vehicle 1', location: 'WA', timesCompliant: 10, compliance: "71%", timesCritical: 3 },
  { timesChecked: 10, forklift: 'VSR Vehicle 2', location: 'WA', timesCompliant: 8, compliance: "80%", timesCritical: 1 },
  // { timesChecked: 20, location: 'Hydrogen', timesCompliant: 15, compliance: "75%", timesCritical: 2 },
];

const ELEMENT_DATA_VSR3: ChecklistData[] = [
  { timesChecked: 30, forklift: 'VSR Vehicle 1', location: 'NSW', timesCompliant: 23, compliance: "77%", timesCritical: 4 },
  { timesChecked: 12, forklift: 'VSR Vehicle 2', location: 'NSW', timesCompliant: 10, compliance: "83%", timesCritical: 1 },
  { timesChecked: 10, forklift: 'VSR Vehicle 1', location: 'STAU', timesCompliant: 3, compliance: "33%", timesCritical: 2 },
  { timesChecked: 16, forklift: 'VSR Vehicle 2', location: 'STAU', timesCompliant: 12, compliance: "75%", timesCritical: 3 },
  { timesChecked: 30, forklift: 'VSR Vehicle 1', location: 'QLD', timesCompliant: 23, compliance: "77%", timesCritical: 4 },
  { timesChecked: 12, forklift: 'VSR Vehicle 2', location: 'QLD', timesCompliant: 10, compliance: "83%", timesCritical: 1 },
  { timesChecked: 10, forklift: 'VSR Vehicle 1', location: 'VIC', timesCompliant: 3, compliance: "33%", timesCritical: 2 },
  { timesChecked: 16, forklift: 'VSR Vehicle 2', location: 'VIC', timesCompliant: 12, compliance: "75%", timesCritical: 3 },
  { timesChecked: 30, forklift: 'VSR Vehicle 1', location: 'WA', timesCompliant: 23, compliance: "77%", timesCritical: 4 },
  { timesChecked: 12, forklift: 'VSR Vehicle 2', location: 'WA', timesCompliant: 10, compliance: "83%", timesCritical: 1 },
  // { timesChecked: 20, location: 'Hydrogen', timesCompliant: 15, compliance: "75%", timesCritical: 2 },
];

const DAILY = [
  { value: 7, viewValue: '7 days' },
  { value: 14, viewValue: '14 days' },
  { value: 30, viewValue: '30 days' }
];

const MONTHLY = [
  { value: 3, viewValue: '3 months' },
  { value: 6, viewValue: '6 months' },
  { value: 12, viewValue: '12 months' }
];


@Component({
  selector: 'app-dashboard',
  templateUrl: './vsr.checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class VSRChecklistComponent implements OnInit {

  displayedColumns: string[] = ['location', 'forklift', 'timesChecked', 'timesCompliant', 'compliance', 'timesCritical'];
  dataSource = new MatTableDataSource<ChecklistData>(ELEMENT_DATA);
  dataSource2 = new MatTableDataSource<ChecklistData>(ELEMENT_DATA_VSR);

  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;

  public selectedOption = 7;
  public selectedOptionVSR = '7';
  public selectedState = 'All';
  public selectedChecklist = 'Daily';

  public weeks = [];

  currentElementData = ELEMENT_DATA_VSR;


  periods = DAILY;

  constructor(private visitService: VisitService) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator1;
    this.dataSource2.paginator = this.paginator2;

    var startDate = moment(new Date(2020, 0, 1));

    if (startDate.date() == 8) {
      startDate = startDate.isoWeekday(-6);
    }

    var today = moment(new Date(2020, 11, 31)).isoWeekday('Sunday');
    while (startDate.isBefore(today)) {
      let startDateWeek = startDate.isoWeekday('Monday').format('DD-MM-YYYY');
      let endDateWeek = startDate.isoWeekday('Sunday').add(7, 'days').format('DD-MM-YYYY');
      startDate.add(7, 'days');
      this.weeks.push([startDateWeek, endDateWeek]);
    }

    console.log(this.weeks);
  }

  filter(data) {
    console.log(data);
    console.log(data.value == 7);
    console.log(this.selectedOption);
    console.log(this.selectedState);
    if (data.value == 7) {
      console.log(data.value);
      this.currentElementData = ELEMENT_DATA_VSR;
      if (this.selectedState != "All") {
        this.dataSource2 = new MatTableDataSource<ChecklistData>(ELEMENT_DATA_VSR.filter(item => item.location == this.selectedState));
      }
      else {
        this.dataSource2 = new MatTableDataSource<ChecklistData>(ELEMENT_DATA_VSR);
      }
    }
    else if (data.value == 14) {
      console.log(data.value);
      this.currentElementData = ELEMENT_DATA_VSR2;
      if (this.selectedState != "All") {
        this.dataSource2 = new MatTableDataSource<ChecklistData>(ELEMENT_DATA_VSR2.filter(item => item.location == this.selectedState));
      }
      else {
        this.dataSource2 = new MatTableDataSource<ChecklistData>(ELEMENT_DATA_VSR2);
      }
    }
    else if (data.value == 30) {
      console.log(data.value);
      this.currentElementData = ELEMENT_DATA_VSR3;
      if (this.selectedState != "All") {
        this.dataSource2 = new MatTableDataSource<ChecklistData>(ELEMENT_DATA_VSR3.filter(item => item.location == this.selectedState));
      }
      else {
        this.dataSource2 = new MatTableDataSource<ChecklistData>(ELEMENT_DATA_VSR3);
      }
    }
  }

  filterState(data) {
    console.log(data);
    if (data.value == 'NSW') {
      console.log(data.value);
      this.dataSource2 = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.location == data.value));
    }
    else if (data.value == 'STAU') {
      console.log(data.value);
      this.dataSource2 = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.location == data.value));
    }
    else if (data.value == 'QLD') {
      console.log(data.value);
      this.dataSource2 = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.location == data.value));
    }
    else if (data.value == 'WA') {
      console.log(data.value);
      this.dataSource2 = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.location == data.value));
    }
    else if (data.value == 'VIC') {
      console.log(data.value);
      this.dataSource2 = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.location == data.value));
    }
    else {
      console.log(data.value);
      this.dataSource2 = new MatTableDataSource<ChecklistData>(this.currentElementData);
    }
  }

  filterChecklist(data) {
    console.log(data);
    if (data.value == 'Daily') {
      this.periods = DAILY;
      this.selectedOption = 7;
    }
    else {
      this.periods = MONTHLY;
      this.selectedOption = 3;
    }
  }
}
