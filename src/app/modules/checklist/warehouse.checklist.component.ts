import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { WarehouseService } from '../../services/warehouse/warehouse.service';

import { FormControl } from '@angular/forms';

export interface ChecklistData {
  timesChecked: number;
  timesCompliant: number;
  compliance: string;
  timesCritical: number;
  state: string;
  warehouse: string;
  address: string;
}

const LAST_YEARS = 2;

const DAILY = [
  { value: 0, displayValue: 'Today' },
  { value: 1, displayValue: 'Yesterday' },
  { value: 7, displayValue: '7 days' },
  { value: 14, displayValue: '14 days' },
  { value: 30, displayValue: '30 days' },
  // { value: ??, displayValue: 'Custom range' }, // custom range?
];

var currentWeek = {};

const WEEKLY = (function() {
  var options = [];
  for (var i = LAST_YEARS; i >= 0; i--) {
    var startYear = new Date(Date.now()).getFullYear() - i;
    var startDate = moment(new Date(startYear, 0, 1));

    if (startDate.date() == 8) {
      startDate = startDate.isoWeekday(-6);
    }

    var today = moment(new Date(startYear, 11, 31)).isoWeekday('Sunday');
    while (startDate.isBefore(today)) {
      let startDateWeek = startDate.isoWeekday('Monday').format('DD-MM-YYYY');
      let startDateISO = startDate.toISOString();
      // let endDateWeek = startDate.isoWeekday('Sunday').add(7, 'days').format('DD-MM-YYYY');
      let endDateWeek = startDate.isoWeekday('Sunday').format('DD-MM-YYYY');
      let endDateISO = startDate.toISOString();

      startDate.add(7, 'days');
      var item = {
        value: startDateWeek,
        endDate: endDateWeek,
        displayValue: startDateWeek + " to " + endDateWeek
      };

      if (moment().isBetween(moment(startDateISO), moment(endDateISO))) {
        currentWeek = item;
      }
      options.push(item);
    }

    console.log(options.length);
  }

  console.log(options);

  return options;
})();

const MONTHLY = (function() {
  var startYear = new Date(Date.now()).getFullYear();

  var startDate = new Date(startYear - LAST_YEARS , 0);
  var options = [{
    value: startDate.toISOString,
    displayValue: (startDate.getMonth() + 1) + "-" + startDate.getFullYear()
  }];

  while (options.length < (12 * (LAST_YEARS+1))) {
    startDate.setMonth(startDate.getMonth() + 1)
    options.push({
      value: startDate.toISOString,
      displayValue: (startDate.getMonth() + 1) + "-" + startDate.getFullYear()
    });
  }

  console.log(options);
  return options;
})();


const ANNUAL = (function() {
  var startDate = new Date(Date.now()).getFullYear()-LAST_YEARS;
  var options = [{ value: startDate, displayValue: startDate  }];

  while (options.length < (LAST_YEARS+1)) {
    startDate++;
    options.push({ value: startDate, displayValue: startDate });
  }

  console.log(options);

  return options;
})();

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

  options = new FormControl();

  displayedColumns: string[] = ['state', 'warehouse', 'address', 'timesChecked', 'timesCompliant', 'compliance', 'timesCritical'];
  dataSource = new MatTableDataSource<ChecklistData>([]);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // filter values
  public selectedOption = [CHECKLIST_OPTIONS[0].periodOptions[0]];
  // public selectedPeriod = CHECKLIST_OPTIONS[0].periodOptions[0];
  public selectedState = '';
  public selectedChecklist = CHECKLIST_OPTIONS[0];

  // data array
  currentElementData = [];

  // filter options array 
  states = ["ACT", "NSW", "NZ", "NT", "QLD", "SA", "TAS", "VIC", "WA"];
  periods = CHECKLIST_OPTIONS[0].periodOptions;
  checklists = CHECKLIST_OPTIONS;

  selectedRange;
  weeks = [];

  // paginator size options
  pageSizeOptions = [10, 20, 40, 100];

  constructor(private whService: WarehouseService) { }

  ngAfterViewInit(): void {
    this.fetchData();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selectedRange = new FormControl();

    var startDate = moment(new Date(2020, 0, 1));

    if (startDate.date() == 8) {
      startDate = startDate.isoWeekday(-6);
    }

    var today = moment(new Date(2020, 11, 31)).isoWeekday('Sunday');
    while (startDate.isBefore(today)) {
      let startDateWeek = startDate.isoWeekday('Monday').format('DD-MM-YYYY');
      // let endDateWeek = startDate.isoWeekday('Sunday').add(7, 'days').format('DD-MM-YYYY');
      let endDateWeek = startDate.isoWeekday('Sunday').format('DD-MM-YYYY');
      startDate.add(7, 'days');
      this.weeks.push([startDateWeek, endDateWeek]);
    }

    console.log(this.weeks);
  }

  // filter period
  filter(data) {
    console.log(data.value == 7);
    // console.log(this.selectedPeriod);
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
    // this.selectedPeriod = data.value.periodOptions[0];
    // handle default value of period to be today / or range of today
    // console.log(data.value.value);
    // console.log((LAST_YEARS * 12) + new Date().getMonth());
    // console.log(data.value.periodOptions[(LAST_YEARS * 12) + new Date().getMonth()]);
    if (data.value.value == "weekly") {
      // this.selectedPeriod = currentWeek;
      this.selectedOption = [currentWeek];
    }
    else if (data.value.value == "monthly") {
      // this.selectedPeriod = data.value.periodOptions[(LAST_YEARS * 12) + new Date().getMonth()];
      this.selectedOption = [data.value.periodOptions[(LAST_YEARS * 12) + new Date().getMonth()]];
    }
    else if (data.value.value == "biannually") {
      // this.selectedPeriod = data.value.periodOptions[data.value.periodOptions.length - 1];
      this.selectedOption = [data.value.periodOptions[data.value.periodOptions.length - 1]];
    }

    this.fetchData();
  }

  filterOptionList(data) {}

  removeOption(data) {
    if (this.selectedOption.length == 1) {
      this.selectedOption = [];
    }
    else this.selectedOption.splice(data, 1);
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

    console.log(params);

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
