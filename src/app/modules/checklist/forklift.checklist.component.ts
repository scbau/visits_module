import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorStateMatcher } from '@angular/material/core';

// import { VisitService } from '../../services/visit/visit.service';
import { ChecklistService } from '../../services/checklist/checklist.service';

import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

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
  location: string;
  forklift: string;
}

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
    displayValue: "Last 7 days"
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
    displayValue: "Last 14 days"
  });

  console.log(options);
  return options;
})();


/*const ELEMENT_DATA: ChecklistData[] = [
  { timesChecked: 7, forklift: 'Forklift 1', location: 'NSW', timesCompliant: 5, compliance: "71%", timesCritical: 0 },
  { timesChecked: 6, forklift: 'Forklift 2', location: 'NSW', timesCompliant: 6, compliance: "100%", timesCritical: 1 },
  { timesChecked: 3, forklift: 'Forklift 1', location: 'SA', timesCompliant: 1, compliance: "33%", timesCritical: 1 },
  { timesChecked: 2, forklift: 'Forklift 2', location: 'SA', timesCompliant: 1, compliance: "50%", timesCritical: 0 },
  { timesChecked: 7, forklift: 'Forklift 1', location: 'WA', timesCompliant: 5, compliance: "71%", timesCritical: 0 },
  { timesChecked: 6, forklift: 'Forklift 2', location: 'WA', timesCompliant: 6, compliance: "100%", timesCritical: 1 },
  { timesChecked: 3, forklift: 'Forklift 1', location: 'QLD', timesCompliant: 1, compliance: "33%", timesCritical: 1 },
  { timesChecked: 2, forklift: 'Forklift 2', location: 'QLD', timesCompliant: 1, compliance: "50%", timesCritical: 0 },
  { timesChecked: 7, forklift: 'Forklift 1', location: 'VIC', timesCompliant: 5, compliance: "71%", timesCritical: 0 },
  { timesChecked: 6, forklift: 'Forklift 2', location: 'VIC', timesCompliant: 6, compliance: "100%", timesCritical: 1 },
  // { timesChecked: 20, location: 'Hydrogen', timesCompliant: 15, compliance: "75%", timesCritical: 2 },
];


const ELEMENT_DATA2: ChecklistData[] = [
  { timesChecked: 14, forklift: 'Forklift 1', location: 'NSW', timesCompliant: 8, compliance: "64%", timesCritical: 2 },
  { timesChecked: 10, forklift: 'Forklift 2', location: 'NSW', timesCompliant: 10, compliance: "100%", timesCritical: 0 },
  { timesChecked: 5, forklift: 'Forklift 1', location: 'SA', timesCompliant: 1, compliance: "20%", timesCritical: 1 },
  { timesChecked: 9, forklift: 'Forklift 2', location: 'SA', timesCompliant: 4, compliance: "89%", timesCritical: 5 },
  { timesChecked: 14, forklift: 'Forklift 1', location: 'WA', timesCompliant: 8, compliance: "64%", timesCritical: 2 },
  { timesChecked: 10, forklift: 'Forklift 2', location: 'WA', timesCompliant: 10, compliance: "100%", timesCritical: 0 },
  { timesChecked: 5, forklift: 'Forklift 1', location: 'QLD', timesCompliant: 1, compliance: "20%", timesCritical: 1 },
  { timesChecked: 9, forklift: 'Forklift 2', location: 'QLD', timesCompliant: 4, compliance: "89%", timesCritical: 5 },
  { timesChecked: 14, forklift: 'Forklift 1', location: 'VIC', timesCompliant: 8, compliance: "64%", timesCritical: 2 },
  { timesChecked: 10, forklift: 'Forklift 2', location: 'VIC', timesCompliant: 10, compliance: "100%", timesCritical: 0 },
  // { timesChecked: 20, location: 'Hydrogen', timesCompliant: 15, compliance: "75%", timesCritical: 2 },
];

const ELEMENT_DATA3: ChecklistData[] = [
  { timesChecked: 30, forklift: 'Forklift 1', location: 'NSW', timesCompliant: 23, compliance: "77%", timesCritical: 4 },
  { timesChecked: 12, forklift: 'Forklift 2', location: 'NSW', timesCompliant: 10, compliance: "83%", timesCritical: 0 },
  { timesChecked: 10, forklift: 'Forklift 1', location: 'SA', timesCompliant: 3, compliance: "33%", timesCritical: 1 },
  { timesChecked: 16, forklift: 'Forklift 2', location: 'SA', timesCompliant: 10, compliance: "62%", timesCritical: 5 },
  { timesChecked: 30, forklift: 'Forklift 1', location: 'WA', timesCompliant: 23, compliance: "77%", timesCritical: 4 },
  { timesChecked: 12, forklift: 'Forklift 2', location: 'WA', timesCompliant: 10, compliance: "83%", timesCritical: 0 },
  { timesChecked: 10, forklift: 'Forklift 1', location: 'QLD', timesCompliant: 3, compliance: "33%", timesCritical: 1 },
  { timesChecked: 16, forklift: 'Forklift 2', location: 'QLD', timesCompliant: 10, compliance: "62%", timesCritical: 5 },
  { timesChecked: 30, forklift: 'Forklift 1', location: 'VIC', timesCompliant: 23, compliance: "77%", timesCritical: 4 },
  { timesChecked: 12, forklift: 'Forklift 2', location: 'VIC', timesCompliant: 10, compliance: "83%", timesCritical: 0 },
  // { timesChecked: 20, location: 'Hydrogen', timesCompliant: 15, compliance: "75%", timesCritical: 2 },
];*/

@Component({
  selector: 'app-dashboard',
  templateUrl: './forklift.checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ForkliftChecklistComponent implements OnInit {

  isLoading = false;

  optionsDaily = new FormControl('valid', [
    Validators.required,
  ]);

  selectedOptionDaily = DAILY[0];
  matcherDaily = new MyErrorStateMatcher();
  periods = DAILY;

  // displayedColumns: string[] = ['location', 'forklift', 'timesChecked', 'timesCompliant', 'compliance', 'timesCritical'];
  displayedColumns: string[] = ['state', 'forkliftName', 'branch', 'address', 'timesChecked', 'timesCompliant', 'compliance', 'timesCritical'];

  dataSource = new MatTableDataSource<ChecklistData>([]);
  // dataSource2 = new MatTableDataSource<ChecklistData>(ELEMENT_DATA_VSR);

  @ViewChild('paginator') paginator: MatPaginator;
  // @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // public selectedOption = '7';
  // public selectedOptionVSR = '7';
  // public selectedState = 'All';

  public weeks = [];

  public selectedState = '';

  currentElementData = [];
  // currentElementData = [];

  states = ["ACT", "NSW", "NZ", "NT", "QLD", "SA", "TAS", "VIC", "WA"];
  pageSizeOptions = [10, 20, 40, 100];

  // constructor(private visitService: VisitService) { }
  constructor(private checklistService: ChecklistService) { }

  ngAfterViewInit(): void {
    this.fetchData();
  }

  ngOnInit(): void {
    this.updateDataSource(this.currentElementData);
  }

  filterOptionList(data) {
    /*this.optionSource = new MatTableDataSource<PeriodData>(this.selectedOption);
    // this.optionSource = new MatTableDataSource<PeriodData>([]);
    this.optionSource.paginator = this.paginator2;*/
    console.log(data);
    console.log(this.selectedState);
    if (data.value.displayValue == "Today") {
      console.log(data.value);
      // this.currentElementData = ELEMENT_DATA;
      if (this.selectedState != "") {
        this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.state == this.selectedState));
      }
      else {
        this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData);
      }
    }
    else if (data.value.displayValue == "Last 7 days") {
      console.log(data.value);
      this.currentElementData = this.currentElementData;
      if (this.selectedState != "") {
        this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.state == this.selectedState));
      }
      else {
        this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData);
      }
    }
    else if (data.value.displayValue == "Last 14 days") {
      console.log(data.value);
      this.currentElementData = this.currentElementData;
      if (this.selectedState != "") {
        this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.state == this.selectedState));
      }
      else {
        this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData);
      }
    }
  }

  /*ngOnInit(): void {
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
  }*/

  /*filter(data) {
    console.log(data);
    console.log(data.value == 7);
    console.log(this.selectedState);
    if (data.value == 7) {
      console.log(data.value);
      this.currentElementData = ELEMENT_DATA;
      if (this.selectedState != "All") {
        this.dataSource = new MatTableDataSource<ChecklistData>(ELEMENT_DATA.filter(item => item.location == this.selectedState));
      }
      else {
        this.dataSource = new MatTableDataSource<ChecklistData>(ELEMENT_DATA);
      }
    }
    else if (data.value == 14) {
      console.log(data.value);
      this.currentElementData = ELEMENT_DATA2;
      if (this.selectedState != "All") {
        this.dataSource = new MatTableDataSource<ChecklistData>(ELEMENT_DATA2.filter(item => item.location == this.selectedState));
      }
      else {
        this.dataSource = new MatTableDataSource<ChecklistData>(ELEMENT_DATA2);
      }
    }
    else if (data.value == 30) {
      console.log(data.value);
      this.currentElementData = ELEMENT_DATA3;
      if (this.selectedState != "All") {
        this.dataSource = new MatTableDataSource<ChecklistData>(ELEMENT_DATA3.filter(item => item.location == this.selectedState));
      }
      else {
        this.dataSource = new MatTableDataSource<ChecklistData>(ELEMENT_DATA3);
      }
    }
  }*/

  /*filterState(data) {
    console.log(data);
    if (data.value == 'NSW') {
      console.log(data.value);
      this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.location == data.value));
    }
    else if (data.value == 'STAU') {
      console.log(data.value);
      this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.location == data.value));
    }
    else if (data.value == 'QLD') {
      console.log(data.value);
      this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.location == data.value));
    }
    else if (data.value == 'WA') {
      console.log(data.value);
      this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.location == data.value));
    }
    else if (data.value == 'VIC') {
      console.log(data.value);
      this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData.filter(item => item.location == data.value));
    }
    else {
      console.log(data.value);
      this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData);
    }
  }*/

  filterState(data) {
    console.log(data);
    if (!data.value) {
      console.log("Clear states filter");
      this.dataSource = new MatTableDataSource<ChecklistData>(this.currentElementData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.pageSizeOptions[3] = this.currentElementData.length;
      console.log(this.currentElementData);
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
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  fetchData() {
    // handle what type of checklist is displayed and must update date range default value
    this.isLoading = true;
    var params = [];

    /*if (this.selectedChecklist.value == 'monthly') {
      for (var option of this.selectedOption) {
        params.push({ from: option.value, to: option.end });
      }
    }*/
    // else {
      params.push({ from: this.selectedOptionDaily.value, to: this.selectedOptionDaily.end });
    // }

    // console.log(this.selectedChecklist.value);

    this.checklistService.fetchData('forklift', 'daily', params)
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
          row["forkliftName"] = item.forkliftName;
          row["state"] = item.state;
          row["address"] = item.address;
          row["branch"] = item.branch;

          result.push(row);
        }

        console.log(states);
        console.log(Object.keys(states));
        this.states = Object.keys(states).sort();

        this.updateDataSource(result);
      });
  }
}