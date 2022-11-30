import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DataserviceService } from '../dataservice.service';
import { NodeData } from '../models/NodeData';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { SubtaskComponent } from '../subtask/subtask.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
      marketPriority: [null, Validators.required],
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
      this.data = res;
      this.getAllUsers();
    })
  }

  openNew() {
    this.record = {};
    this.submitted = false;
    this.productDialog = true;
  }

  getProjectDetails(id) {
    this.dataservice.getProjectDetails(id).subscribe((res) => {
      this.dataservice.setselectedProject(res[0]);
      this.router.navigate([`project-details/${id}`])
    }, (error) => {
      console.log(error)
    })
  }

  closeDialog() {
    this.productDialog = false;
  }

  createProject() {
    this.dataservice.createRecord(this.form.value).subscribe((res) => {
      console.log(res)
      this.productDialog = false;
      this.form.reset();
      this.data = res;
    })
    console.log(this.form)
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
  deleteRecord(record) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + record.projectName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataservice.deleteRecord(record).subscribe((data) => {
          console.log(data)
          this.data = this.data.filter(val => val.IDX !== record.IDX);
        })
        this.record = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
      }
    });
  }

  statusChangeHandler(e, popup) {
    if (popup) {
      let progress = e.value.endsWith('In Progress') ? 20 : e.value.endsWith('In Review') ? 40 : e.value.endsWith('In Test Env') ? 60 : e.value.endsWith('QA Passed') ? 80 : e.value.endsWith('In Production') ? 90 : e.value.endsWith('Done') ? 100 : 0;
      this.form.get("progress").setValue(progress);
    }
  }

}
