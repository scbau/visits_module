import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorStateMatcher } from '@angular/material/core';

import { WarehouseService } from '../../services/warehouse/warehouse.service';

import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface ChecklistData {
  timesChecked: number;
  timesCompliant: number;
  compliance: string;
  timesCritical: number;
  state: string;
  warehouse: string;
  address: string;
}

export interface PeriodData {
  period: string;
  close: string;
}

const LAST_YEARS = 2;

var DAILY = [
  { value: 0, displayValue: 'Today' },
  { value: 1, displayValue: 'Yesterday' },
  { value: 7, displayValue: '7 days' },
  { value: 14, displayValue: '14 days' },
  { value: 30, displayValue: '30 days' },
  // { value: ??, displayValue: 'Custom range' }, // custom range?
];

var currentWeek = {};

var WEEKLY = (function() {
  var options = [];
  var start = new Date(Date.now()).getFullYear();
  for (var i = LAST_YEARS; i >= 0; i--) {
    var startYear = start - i;
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

      var end = new Date(endDateISO);
      end.setDate(end.getDate() + 1);
      end.setMilliseconds(end.getMilliseconds() - 1);

      startDate.add(7, 'days');
      var item = {
        value: startDateISO,
        end: end.toISOString(),
        displayValue: startDateWeek + " to " + endDateWeek
      };

      if (moment().isBetween(moment(startDateISO), moment(endDateISO), undefined, '[]')) { // 6/15 0:00:00 to 6/21   0:00:00
        currentWeek = item;
      }
      options.push(item);
    }
  }

  console.log(options);

  return options;
})();

var MONTHLY = (function() {
  var startYear = new Date(Date.now()).getFullYear();

  var startDate = new Date(startYear - LAST_YEARS , 0, 1);
  startDate.setHours(0, 0, 0, 0);

  var endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  var options = [{
    value: startDate.toISOString(),
    end: endDate.toISOString(),
    displayValue: (startDate.getMonth() + 1) + "-" + startDate.getFullYear()
  }];

  while (options.length < (12 * (LAST_YEARS+1))) {
    startDate.setMonth(startDate.getMonth() + 1);
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setMilliseconds(endDate.getMilliseconds() - 1);

    options.push({
      value: startDate.toISOString(),
      end: endDate.toISOString(),
      displayValue: (startDate.getMonth() + 1) + "-" + startDate.getFullYear()
    });
  }

  console.log("MONTHLY", options);
  return options;
})();


var ANNUAL = (function() {
  var startDate = new Date(Date.now());
  startDate.setFullYear(startDate.getFullYear() - LAST_YEARS, 0, 1);
  startDate.setHours(0, 0, 0, 0);
  var endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  var options = [{ 
    value: startDate.toISOString(), 
    end: endDate.toISOString(),
    displayValue: startDate.getFullYear()  
  }];

  while (options.length < (LAST_YEARS+1)) {
    startDate.setFullYear(startDate.getFullYear() + 1);
    endDate.setFullYear(endDate.getFullYear() + 1);
    options.push({ 
      value: startDate.toISOString(),
      end: endDate.toISOString(), 
      displayValue: startDate.getFullYear() 
    });
  }

  console.log("ANNUAL", options);

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

  options = new FormControl('valid', [
    Validators.required,
  ]);
  matcher = new MyErrorStateMatcher();

  displayedColumns: string[] = ['state', 'warehouse', 'address', 'timesChecked', 'timesCompliant', 'compliance', 'timesCritical'];
  displayedOptionColumns: string[] = ['period', 'close'];
  dataSource = new MatTableDataSource<ChecklistData>([]);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // filter values
  public selectedOption = [CHECKLIST_OPTIONS[0].periodOptions[0]];
  optionSource = new MatTableDataSource<PeriodData>(this.selectedOption);
  // public selectedPeriod = CHECKLIST_OPTIONS[0].periodOptions[0];
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
    this.updateDataSource(this.currentElementData);
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
    this.periods = data.value.periodOptions;
    var tempArray = [];

    if (data.value.value == "daily") { // daily checklist handler
      // !!!TODO
      console.log("daily checklist")
    }
    else if (data.value.value == "weekly") { // weekly checklist handler
      tempArray.push(currentWeek);
    }
    else if (data.value.value == "monthly") { // monthly checklist handler
      tempArray.push(data.value.periodOptions[(LAST_YEARS * 12) + new Date().getMonth()]);
    }
    else if (data.value.value == "biannually") { // biannually checklist handler
      tempArray.push(data.value.periodOptions[data.value.periodOptions.length - 1]);
    }
    this.updateOptionSource(tempArray);
    this.fetchData();
  }

  filterOptionList(data) {
    this.optionSource = new MatTableDataSource<PeriodData>(this.selectedOption);
    this.optionSource.paginator = this.paginator2;
  }

  private updateOptionSource(optionList) {
    this.selectedOption = optionList;
    this.optionSource = new MatTableDataSource<PeriodData>(this.selectedOption);
    this.optionSource.paginator = this.paginator2;
  }

  private updateDataSource(dataList) {
    this.currentElementData = dataList;
    var tempArray = [];
    if (!this.selectedState) {
      tempArray = this.currentElementData;
    }
    else {
      // this.dataSource = new MatTableDataSource
      tempArray = this.currentElementData.filter(item => item.state == this.selectedState)
    }
    this.dataSource = new MatTableDataSource<ChecklistData>(tempArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.pageSizeOptions[3] = this.currentElementData.length;
  }

  removeOption(data) {
    var tempArray = this.selectedOption.filter(function(value, index, arr) {
      return value.value != data.value;
    });

    this.updateOptionSource(tempArray);
  }

  // query data
  fetchData() {
    // handle what type of checklist is displayed and must update date range default value
    var params = [];
    if (this.selectedChecklist.value != 'daily') {
      for (var option of this.selectedOption) {
        params.push({ from: option.value, to: option.end });
      }
    }

    console.log(params);

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

        this.updateDataSource(result);
      });
  }

  resetPeriodFilter() {

    var data = this.selectedChecklist, tempArray = [];

    if (data.value == "daily") { // daily checklist handler
      //
      console.log("daily checklist")
    }
    else if (data.value == "weekly") { // weekly checklist handler
      tempArray.push(currentWeek);
    }
    else if (data.value == "monthly") { // monthly checklist handler
      tempArray.push(data.periodOptions[(LAST_YEARS * 12) + new Date().getMonth()]);
    }
    else if (data.value == "biannually") { // biannually checklist handler
      tempArray.push(data.periodOptions[data.periodOptions.length - 1]);
    }

    this.updateOptionSource(tempArray);
    this.fetchData();
  }
}
