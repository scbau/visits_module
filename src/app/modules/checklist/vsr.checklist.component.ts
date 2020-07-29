import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorStateMatcher } from '@angular/material/core';

import { ChecklistService } from '../../services/checklist/checklist.service';
// import { UiService } from '../../services/overlay/ui.service'

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
  vehicle: string;
  address: string;
  frequencyCompliance: number;
  expectedCheckCount: number;
}

export interface PeriodData {
  displayValue: string;
}

const LAST_YEARS = 2;

const DAILY = (function() {
  var startDate = new Date(Date.now());
  startDate.setHours(0, 0, 0, 0);
  var endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  var options = [{
    value: startDate.toISOString(),
    end: endDate.toISOString(),
    displayValue: "Today"
  }];

  startDate.setDate(startDate.getDate() - 1);
  endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  options.push({
    value: startDate.toISOString(),
    end: endDate.toISOString(),
    displayValue: "Yesterday"
  });

  startDate = new Date(Date.now());
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 7);
  endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  options.push({
    value: startDate.toISOString(),
    end: endDate.toISOString(),
    displayValue: "Last 7 days (" + startDate.toLocaleDateString("en-AU") + " to " + endDate.toLocaleDateString("en-AU") + ")"
  });

  startDate = new Date(Date.now());
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 14);
  endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 14);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  options.push({
    value: startDate.toISOString(),
    end: endDate.toISOString(),
    displayValue: "Last 14 days (" + startDate.toLocaleDateString("en-AU") + " to " + endDate.toLocaleDateString("en-AU") + ")"
  });

  startDate = new Date(Date.now());
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 30);
  endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  options.push({
    value: startDate.toISOString(),
    end: endDate.toISOString(),
    displayValue: "Last 30 days (" + startDate.toLocaleDateString("en-AU") + " to " + endDate.toLocaleDateString("en-AU") + ")"
  });

  console.log(options);
  return options;
})();

const MAINTENANCE = DAILY;

const MONTHLY = (function() {
  var startYear = new Date(Date.now()).getFullYear();

  var startDate = new Date(startYear - LAST_YEARS, 0, 1);
  startDate.setHours(0, 0, 0, 0);

  var endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  var options = [{
    value: startDate.toISOString(),
    end: endDate.toISOString(),
    displayValue: (startDate.getMonth() + 1) + "-" + startDate.getFullYear()
  }];

  while (options.length < (12 * (LAST_YEARS + 1))) {
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

const CHECKLIST_OPTIONS = [
  {
    value: 'daily',
    displayValue: 'Daily',
    periodOptions: DAILY,
    dateUnit: 1
  },
  {
    value: 'monthly',
    displayValue: 'Monthly',
    periodOptions: MONTHLY,
    dateUnit: 30
  },
  /*{
    value: 'maintenance',
    displayValue: 'Maintenance',
    periodOptions: MAINTENANCE,
    dateUnit: 1
  }*/
]


@Component({
  selector: 'app-dashboard',
  templateUrl: './vsr.checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class VSRChecklistComponent implements OnInit, AfterViewInit {

  expectedCheckCount = 0;
  isLoading = false;

  options = new FormControl('valid', [
    Validators.required,
  ]);
  optionsDaily = new FormControl('valid', [
    Validators.required,
  ]);
  matcher = new MyErrorStateMatcher();
  matcherDaily = new MyErrorStateMatcher();

  displayedColumns: string[] = ['state', 'vehicle', 'address', 'timesChecked', 'timesCompliant', 'frequencyCompliance', 'compliance', 'timesCritical'];
  displayedOptionColumns: string[] = ['period', 'close'];
  dataSource = new MatTableDataSource<ChecklistData>([]);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public selectedOption = [CHECKLIST_OPTIONS[0].periodOptions[0]];
  selectedOptionDaily = DAILY[0];
  optionSource = new MatTableDataSource<PeriodData>(this.selectedOption);
  // optionSource = new MatTableDataSource<PeriodData>([]);
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

  // constructor(private checklistService: ChecklistService, private ui: UiService) { }
  constructor(private checklistService: ChecklistService) { }

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
      this.selectedOptionDaily = data.value.periodOptions[0];
    }
    else if (data.value.value == "monthly") { // monthly checklist handler
      tempArray.push(data.value.periodOptions[(LAST_YEARS * 12) + new Date().getMonth()]);
    }
    else if (data.value.value == "maintenance") { // biannually checklist handler
      this.selectedOptionDaily = data.value.periodOptions[0];
    }
    this.updateOptionSource(tempArray);
    this.fetchData();
  }

  filterOptionList(data) {
    this.optionSource = new MatTableDataSource<PeriodData>(this.selectedOption);
    // this.optionSource = new MatTableDataSource<PeriodData>([]);
    this.optionSource.paginator = this.paginator2;
  }

  private updateOptionSource(optionList) {
    this.selectedOption = optionList;
    this.optionSource = new MatTableDataSource<PeriodData>(this.selectedOption);
    // this.optionSource = new MatTableDataSource<PeriodData>([]);
    this.optionSource.paginator = this.paginator2;
  }

  private updateDataSource(dataList) {
    this.currentElementData = dataList;
    this.expectedCheckCount = dataList[0].expectedCheckCount;
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
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
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
    this.isLoading = true;
    var params = [];
    
    if (this.selectedChecklist.value == 'monthly') {
      for (var option of this.selectedOption) {
        params.push({ from: option.value, to: option.end });
      }
    }
    else {
      params.push({ from: this.selectedOptionDaily.value, to: this.selectedOptionDaily.end });
    }

    console.log(this.selectedChecklist.value);

    this.checklistService.fetchData('vsr', this.selectedChecklist.value, params)
      .subscribe((data: any) => {
        console.log(data);

        var result = [];
        var states = {};

        var arrayData = data.data;
        for (var item of arrayData) {

          if (!item.enable) {
            console.log("skipping");
            continue;
          }
          
          if (!states[item.stateReg]) {
            states[item.stateReg] = 1;
          }
          else {
            states[item.stateReg]++;
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
          row["expectedCheckCount"] = item.expectedCheckCount;
          row["frequencyCompliance"] = row["timesChecked"] / item.expectedCheckCount;
          row["vehicle"] = item.rego;
          row["state"] = item.stateReg;
          row["address"] = item.branch;

          result.push(row);
        }

        console.log(states);
        console.log(Object.keys(states));
        this.states = Object.keys(states).sort();

        this.updateDataSource(result);
      });
  }

  resetPeriodFilter() {

    var data = this.selectedChecklist, tempArray = [];

    if (data.value == "daily") { // daily checklist handler
      this.selectedOptionDaily = DAILY[0];
    }
    else if (data.value == "monthly") { // monthly checklist handler
      tempArray.push(data.periodOptions[(LAST_YEARS * 12) + new Date().getMonth()]);
    }
    else if (data.value == "maintenance") { // biannually checklist handler
      // tempArray.push(data.periodOptions[data.periodOptions.length - 1]);
      this.selectedOptionDaily = MAINTENANCE[0];
    }

    this.updateOptionSource(tempArray);
    this.fetchData();
  }
}
