import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DataserviceService } from '../dataservice.service';
import { NodeData } from '../models/NodeData';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { SubtaskComponent } from '../subtask/subtask.component';
@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  productDialog?: boolean = false;

  record?: NodeData;

  selectedProducts?: NodeData[] = [];

  submitted?: boolean = false;

  statuses?: any[] = [];

  data?: any[] = [];

  form: FormGroup;

  priorityTypes: string[];

  projectTypes: string[];

  statusTypes: string[];

  progress: any;
  projectManagers: any;
  hoursInPRMs: any[];
  checkList: ({ name: string; code: string; inactive: boolean; } | { name: string; code: string; inactive?: undefined; })[];
  selectedChecklist: any[];

  constructor(public dialogService: DialogService, private dataservice: DataserviceService, private router: Router, private formBuilder: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    // this.files = [];
    this.getData()
    this.form = this.formBuilder.group({
      PRM: [null, Validators.required],
      projectName: [null, Validators.required],
      hoursInPRM: [null, Validators.required],
      issueType: [null, Validators.required],
      priority: [null, Validators.required],
      checkList: [null, Validators.required],
      region: [null, Validators.required],
      projectManager: [null, Validators.required],
      status: [null, Validators.required],
      estimatedHours: [null, Validators.required],
      startDate: [null, Validators.required],
      goLive: [null, Validators.required],
      progress: [null, Validators.required],
    });
    this.projectTypes = [
      'Subtask',
      'Defect',
      'Story',
      'Bug',
      'Change Request'
    ],
      this.hoursInPRMs = [
        'True',
        'False'
      ],
      this.statusTypes = [
        "Done", "In Progress", "In Review", "Abandoned", "Blocked", "In Test Env", "QA Passed", "In Production"
      ].sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) return -1
        if (a.toLowerCase() > b.toLowerCase()) return 1
        return 0
      })
    this.checkList = [
      { name: "Done", code: "Done", inactive: false },
      { name: "In Progress", code: "In Progress" },
      { name: "In Review", code: "In Review" },
      { name: "Abandoned", code: "Abandoned" },
      { name: "Blocked", code: "Blocked" },
      { name: "In Test Env", code: "In Test Env" },
      { name: "QA Passed", code: "QA Passed" },
      { name: "In Production", code: "In Production" }
    ].sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
      return 0
    })
    this.priorityTypes = [
      "Lowest", "Low", "Medium", "High", "Highest"
    ].sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1
      if (a.toLowerCase() > b.toLowerCase()) return 1
      return 0
    })
  }

  getData() {
    this.dataservice.getAllData().subscribe((res) => {
      this.data = res.filter((x) => x.status.toLowerCase() === "done");
      this.getAllUsers();
    })
  }


  closeDialog() {
    this.productDialog = false;
  }

  getAllUsers() {
    this.dataservice.getAllUsers().subscribe((res) => {
      this.dataservice.allUsers.next(res);
      this.projectManagers = res.map((x) => {
        return x.FirstName + ' ' + x.LastName
      })
    })
  }

  show(record) {
    const ref = this.dialogService.open(SubtaskComponent, {
      data: {
        id: record.IDX
      },
      header: `Subtasks linked with ${record.projectName}`,
      width: '70%'
    });
  }

  statusChangeHandler(e, popup) {
    if (popup) {
      let progress = e.value.endsWith('In Progress') ? 20 : e.value.endsWith('In Review') ? 40 : e.value.endsWith('In Test Env') ? 60 : e.value.endsWith('QA Passed') ? 80 : e.value.endsWith('In Production') ? 90 : e.value.endsWith('Done') ? 100 : 0;
      this.form.get("progress").setValue(progress);
    }
  }




}
