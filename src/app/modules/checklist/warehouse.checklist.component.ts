import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { WarehouseService } from '../../services/warehouse/warehouse.service';

export interface ChecklistData {
  timesChecked: number;
  timesCompliant: number;
  compliance: string;
  timesCritical: number;
  state: string;
  warehouse: string;
  address: string;
}

const DAILY = [
  { value: 0, displayValue: 'Today' },
  { value: 7, displayValue: '7 days' },
  { value: 14, displayValue: '14 days' },
  { value: 30, displayValue: '30 days' }
];

const WEEKLY = [
  { value: 0, displayValue: 'Current week' },
  { value: 1, displayValue: '1 week' },
  { value: 2, displayValue: '2 weeks' },
  { value: 4, displayValue: '4 weeks' },
  { value: 8, displayValue: '8 weeks' }
];

const MONTHLY = [
  { value: 0, displayValue: 'Current month' },
  { value: 1, displayValue: '1 month' },
  { value: 3, displayValue: '3 months' },
  { value: 6, displayValue: '6 months' },
  { value: 12, displayValue: '12 months' }
];

const ANNUAL = [
  { value: 0, displayValue: 'Current year' },
  { value: 1, displayValue: '1 year' },
  { value: 2, displayValue: '2 years' },
  { value: 4, displayValue: '4 years' }
];

const CHECKLIST_OPTIONS = [
  {
    value: 'daily',
    displayValue: 'Daily',
    periodOptions: DAILY,
    dateUnit: 1
  },
  {
    value: 'weekly',
    displayValue: 'Weekly',
    periodOptions: WEEKLY,
    dateUnit: 7
  },
  {
    value: 'monthly',
    displayValue: 'Monthly',
    periodOptions: MONTHLY,
    dateUnit: 30
  },
  {
    value: 'biannually',
    displayValue: 'Biannually',
    periodOptions: ANNUAL,
    dateUnit: 1
  }
]


@Component({
  selector: 'app-dashboard',
  templateUrl: './warehouse.checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class WarehouseChecklistComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['state', 'warehouse', 'address', 'timesChecked', 'timesCompliant', 'compliance', 'timesCritical'];
  dataSource = new MatTableDataSource<ChecklistData>([]);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // filter values
  public selectedPeriod = CHECKLIST_OPTIONS[0].periodOptions[0];
  public selectedState = '';
  public selectedChecklist = CHECKLIST_OPTIONS[0];

  // data array
  currentElementData = [];

  // filter options array 
  states = ["ACT", "NSW", "NZ", "NT", "QLD", "SA", "TAS", "VIC", "WA"];
  periods = CHECKLIST_OPTIONS[0].periodOptions;
  checklists = CHECKLIST_OPTIONS;

  // paginator size options
  pageSizeOptions = [10, 20, 40, 100];

  constructor(private whService: WarehouseService) { }

  ngAfterViewInit(): void {
    this.fetchData();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    /*this.selectedRange = new FormControl();

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

    console.log(this.weeks);*/
  }

  // filter period
  filter(data) {
    console.log(data.value == 7);
    console.log(this.selectedPeriod);
    console.log(this.selectedState);
  }

  // filter state
  filterState(data) {
    console.log(data);
    if (!data.value) {
      console.log("Clear states filter");
      this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.pageSizeOptions[3] = this.currentElementData.length;
    }
    else {
      console.log(`States filter: ${data.value}`);
      var tempArray = this.currentElementData.filter(item => item.state == data.value)
      this.dataSource = new MatTableDataSource<ChecklistData>(tempArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.pageSizeOptions[3] = tempArray.length;
    }
  }

  // filter checklist type (daily, weekly, monthly, biannually)
  filterChecklist(data) {
    console.log(data);

    this.periods = data.value.periodOptions;
    this.selectedPeriod = data.value.periodOptions[0];
    this.fetchData();
  }

  // query data
  fetchData() {
    var toDate = new Date();
    toDate.setHours(23, 59, 59, 999);

    var fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7); // insert period handling here
    fromDate.setHours(0, 0, 0, 0);

    var to = moment(toDate);
    var from = moment(fromDate);

    console.log(from.format('DD-MM-YYYY HH:mm:ss'));
    console.log(to.format('DD-MM-YYYY HH:mm:ss'));

    var params = { from, to };

    // insert checklist type handling here
    // this.whService.fetchDailyCompliance(from.toISOString(), to.toISOString())
    this.whService.fetchData(this.selectedChecklist.value, params)  
      .subscribe((data: any) => {
        console.log(data);

        var result = [];
        var states = {};

        var arrayData = data.data;
        for (var item of arrayData) {
          if (!states[item.state]) {
            states[item.state] = 1;
          }
          else {
            states[item.state]++;
          }

          var row = {};
          if (item.hasOwnProperty("stats")) {
            row = item.stats;
          }
          else {
            row = {
              timesChecked: 0,
              timesCompliant: 0,
              compliance: 0,
              timesCritical: 0
            }
          }
          row["warehouse"] = item.site;
          row["state"] = item.state;
          row["address"] = item.address;

          result.push(row);
        }

        console.log(states);
        console.log(Object.keys(states));

        // this.states = Object.keys(states);
        this.currentElementData = result;
        this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageSizeOptions[3] = this.currentElementData.length;
      });
  }
}
