import { Component, OnInit } from '@angular/core';

import { VisitService } from '../../services/visit/visit.service'


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  uploadedFiles = [];

  constructor(private visitService: VisitService) { }

  ngOnInit(): void {
  }

  fileChange(element) {
    this.uploadedFiles = element.target.files;
  }

  upload() {
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
    }
    this.visitService.uploadPlan(formData)
      .subscribe((response) => {
        console.log('response received is ', response);
      })
  }
}
